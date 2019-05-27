import React, { Component } from 'react';
import { View, Image, ScrollView, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Slider from '@react-native-community/slider';
import { Subheading, Card, FAB, withTheme, ActivityIndicator, IconButton, Title, Divider, Caption, Text } from 'react-native-paper';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import { ProgressComponent } from 'react-native-track-player';

import { playMedia, updatePlayerStatus } from '../actions';
import Track from './Track';
import Love from './Love';


class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            img: '',
            artist: '',
            isLoading: false,
            songs: [],
            queue: [],
            isPlaying: false,
            modalVisible: false
        }
    }


    componentDidMount() {
        // console.log("component did mount happening")
        TrackPlayer.setupPlayer({}).then(() => {
            TrackPlayer.updateOptions({
                stopWithApp: true,
                capabilities: [
                    TrackPlayer.CAPABILITY_PLAY,
                    TrackPlayer.CAPABILITY_PAUSE,
                    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                ],
                icon: require('../assets/icons/app-icon.png'),
            });
        })
        this._onStateChanged = TrackPlayer.addEventListener('playback-state', async (data) => {
            if (data.state == 3) {
                this.setState({
                    isPlaying: true,
                    isLoading: false
                })
            }
            else if (data.state == 2) {
                this.setState({
                    isPlaying: false,
                    isLoading: false
                })
            }
            else if (data.state == 6) {
                this.setState({
                    isLoading: true,
                    isPlaying: false
                })
            }
            else {
                // console.log(data.state);
                this.setState({
                    isPlaying: false,
                    isLoading: false
                })
            }
        });

        this._onTrackChanged = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
            if (data.nextTrack) {
                TrackPlayer.getTrack(data.nextTrack)
                .then((track) => {
                    if (track) {
                        this.setState({
                            title: track.title,
                            artist: track.artist,
                            img: { uri: track.artwork },
                        })
                    }
                })
                
            }
        })
    }

    // componentWillMount() {
    //     this.updateTrack();
    // }

    componentWillUnmount() {
        this._onStateChanged.remove();
        this._onTrackChanged.remove();
        TrackPlayer.destroy();
    }


    componentWillReceiveProps(nextProps) {
        if (!_.isEmpty(nextProps.queue)) {
           this.setState({
               queue: nextProps.queue
           })
           this.addToQueue(nextProps.queue)
        //    this.updateTrack()
        }
        if(nextProps.active){
            TrackPlayer.getCurrentTrack()
            .then((trackId) => {
                if (trackId != nextProps.active.id) {
                    TrackPlayer.skip(nextProps.active.id)
                        .then(() => {
                            // this.updateTrack();
                            TrackPlayer.play();
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
           
        }
    }

    skipToNext = () => {
        try {
            TrackPlayer.skipToNext().then(() => {
                TrackPlayer.play();
            })
        } catch (error) {
            console.log(error);
            TrackPlayer.stop();
        }
    }

    skipToPrevious = () => {
        try {
            TrackPlayer.skipToPrevious().then(() => {
                TrackPlayer.play();
            });
        } catch (error) {
            console.log(error);
            TrackPlayer.stop();
        }
        
    }

    addToQueue = (queue) => {
        // console.log("adding queue to track player", queue);
        TrackPlayer.add(queue).then(() => {
            TrackPlayer.play();
        })
    }

    togglePlayback = () => {
        TrackPlayer.getCurrentTrack().then((currentTrack) => {
            if (currentTrack == null) {
                TrackPlayer.reset();
                // console.log("adding queue to track player", this.state.queue);
                TrackPlayer.add(this.state.queue).then(() => {
                    TrackPlayer.play();
                });
            } else {
                if (!this.state.isPlaying) {
                    TrackPlayer.play();
                    // console.log("trying to play")
                } else {
                    TrackPlayer.pause();
                }
            }
        })
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    render() {

        const { colors } = this.props.theme;


        const { children } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {children}
                </View>
                { _.isEmpty(this.state.queue) && !this.state.title ? false :
                    <View>
                        <Modal
                            animationType={'slide'}
                            transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
                                    <IconButton
                                        icon="close"
                                        // size={20}
                                        onPress={() => this.setModalVisible(!this.state.modalVisible)}
                                    />
                                    <IconButton
                                        icon="more-vert"
                                        // size={20}
                                        onPress={() => this.setModalVisible(!this.state.modalVisible)}
                                    />

                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Card.Cover source={ this.state.img } style={{ width: 250, height: 250, borderRadius: 4 }} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8 }}>
                                    <Love/>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Title numberOfLines={1}>{this.state.title}</Title>
                                        <Subheading numberOfLines={1}>{this.state.artist}</Subheading>
                                    </View>

                                    <IconButton
                                        icon="more-vert"
                                        // size={20}
                                        onPress={() => console.log("pressed")}
                                    />
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TrackStatus theme={this.props.theme}/>

                                    {/* <Caption>{this._getTimestamp()}</Caption> */}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: 12 }}>
                                    <IconButton
                                        icon="skip-previous"
                                        size={40}
                                        onPress={this.skipToPrevious}
                                    />
                                    {this.state.isLoading ?
                                        <ActivityIndicator animating={true} />
                                        :
                                        <FAB
                                            icon={this.state.isPlaying ? "pause" : "play-arrow"}
                                            onPress={this.togglePlayback}
                                        />
                                    }
                                    <IconButton
                                        icon="skip-next"
                                        size={40}
                                        onPress={this.skipToNext}
                                    />
                                </View>
                                <Divider />
                                <Title style={{ padding: 10 }}>Queue</Title>
                                <Divider />
                                <FlatList
                                    data={this.state.queue}
                                    renderItem={({ item }) => <Track track={item} active={this.state.title} />}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                <View style={{ height: 100 }} />
                            </ScrollView>
                        </Modal>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={{ zIndex: 10, position: 'absolute', height: 60, width: '100%', bottom: 0 }}
                            onPress={() => {
                                this.setModalVisible(true);
                            }}>
                            <View style={[styles.bar, { backgroundColor: colors.background }]}>
                                { this.state.img ? <Image source={ this.state.img } style={{ width: 50, height: 50, borderRadius: 4 }} /> : false }
                                <View>
                                    <Subheading numberOfLines={1}>{this.state.title}</Subheading>
                                </View>
                                <View style={{ justifyContent: 'center', marginRight: 4 }}>
                                    { this.state.isLoading ? 
                                        <ActivityIndicator animating={true} />
                                        :
                                        <IconButton
                                            icon={this.state.isPlaying ? "pause" : "play-arrow"}
                                            // color={Colors.red500}
                                            animated={true}
                                            size={34}
                                            onPress={this.togglePlayback}
                                        />
                                    }
                                </View>
                                
                            </View>
                        </TouchableOpacity>
                    </View>
                   }
            </View>
        );
    }
}

export class TrackStatus extends ProgressComponent {
    state = {
        duration: 0,
        isSeeking: false,
        position: 0,
        SliderDisable: true
    }
    formatTime(seconds) {
        if (this.state.SliderDisable) {
            this.TrackSlider();
        }
        return seconds > 3600
            ?
            [
                parseInt(seconds / 60 / 60),
                parseInt(seconds / 60 % 60),
                parseInt(seconds % 60)
            ].join(":").replace(/\b(\d)\b/g, "0$1")
            :
            [
                parseInt(seconds / 60 % 60),
                parseInt(seconds % 60)
            ].join(":").replace(/\b(\d)\b/g, "0$1")
    }

    componentDidMount() {
        TrackPlayer.getDuration().then(
            duration => this.setState({ duration }),

        )
        TrackPlayer.getPosition().then(
            position => this.setState({ position }),

        )

    }

    TrackSlider = () => {
        TrackPlayer.getState()
        .then((state) => {
            if (state == 2) {
                this.setState({
                    SliderDisable: false
                });
            } else if (state == 3) {
                this.setState({
                    SliderDisable: false
                });
            } else if (state == 0) {
                this.setState({
                    SliderDisable: true
                });
            }
        })
    }

    render() {
        const { colors } = this.props.theme;
        return (
            <View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Caption>{this.formatTime(this.state.position)}</Caption>
                    <Slider
                        minimumValue={0}
                        maximumValue={this.state.duration}
                        thumbTintColor={colors.primary}
                        minimumTrackTintColor='#000000'
                        maximumTrackTintColor='#808080'
                        step={1}
                        disabled={this.state.SliderDisable}
                        onValueChange={val => {
                            TrackPlayer.pause();
                            this.seek = val;
                            this.setState({ isSeeking: true })
                        }}
                        onSlidingComplete={val => {
                            TrackPlayer.play();
                            this.setState(() => {
                                TrackPlayer.seekTo(this.seek);
                                this.position = this.seek;
                            })
                        }}
                        // value={this.state.isSeeking ? this.seek : this.state.position}
                        value={this.state.position}
                        style={{ width: '75%' }}
                    />
                    <Caption>{this.formatTime(this.state.duration)}</Caption>
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    queue: state.media.queue,
    active: state.media.active
});

export default connect(mapStateToProps, { playMedia, updatePlayerStatus })(withTheme(Player));

const styles = StyleSheet.create({
    bar: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 8,
        elevation: 8
    },
    container: {
        justifyContent: 'center', 
        alignItems: 'center'
    }
})
