import * as React from 'react';
import { withTheme, Title, Card, Paragraph } from 'react-native-paper';
import { StyleSheet, View, ScrollView, FlatList, Dimensions } from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';

import NetworkContainer from '../../containers/NetworkContainer';
import Media from '../../data/media.json';
import Top20 from '../../data/top20.json';
import ImageBackground from '../../containers/ImageBackground';
import { TouchableOpacity } from 'react-native-gesture-handler';


class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            isLoaded: false
        }
    }

    static navigationOptions = {
        header: null
    };


    apiRequests = () => {
        if (!this.state.isLoaded) {
            this.setState({
                isLoaded: true
            })
        }
    }

    componentDidMount(){
        this.apiRequests();
    }

    render() {
        const { colors } = this.props.theme

        const { navigate } = this.props.navigation;

        return (
            <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
                
                <View style={{ marginTop: 10 }}>
                    {/* <FlatList
                        pagingEnabled={true}
                        horizontal={true}
                        data={Media}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <View key={item.id} style={{ alignItems: 'center', width: Dimensions.get('window').width }}>
                                <ImageBackground style={{ width: '100%', height: 200, alignItems: 'center', justifyContent: 'center', borderRadius: 4 }} source={{ uri: item.artwork }}>
                                    <Title numberOfLines={1}>{item.album}</Title>
                                </ImageBackground>
                            </View>
                        }
                    /> */}
                    <Title style={styles.title}>Recents</Title>
                        <FlatList
                            horizontal={true}
                            data={Media}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) =>
                                <TouchableOpacity 
                                    style={{ alignItems: 'center' }}
                                    onPress={() => navigate('Songs', { songs: item.songs, img: item.artwork, title: item.album })}
                                >
                                    <FastImage
                                        source={{ uri: item.artwork }}
                                        style={styles.photo}
                                        
                                    />
                                    <Paragraph numberOfLines={1}>{item.album}</Paragraph>
                                </TouchableOpacity>
                            }
                        />

                    <Title style={styles.title}>Top 15</Title>
                    <FlatList
                        horizontal={true}
                        data={Top20}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) =>
                            <TouchableOpacity style={{ alignItems: 'center' }}>
                                <FastImage
                                    source={{ uri: item.artwork }}
                                    style={styles.photo}
                                    onPress={() => navigate('Songs', { songs: item.songs, img: item.artwork, title: item.album })}
                                />
                                <Paragraph numberOfLines={1}>{item.album}</Paragraph>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </ScrollView>
        );
    }
}

export default withTheme(MainScreen);

const styles = StyleSheet.create({
    title: {
        paddingTop: 10,
        textAlign: 'center'
    },
    photo: {
        width: 120,
        height: 120,
        margin: 4,
        borderRadius: 12,
        elevation: 4
    },
    cardWrapper: {
        width: 120,
        alignItems: 'center',
        margin: 4
    },
    napsterCard: {
        width: 120,
        height: 120,
        margin: 4
    },
    saavanCard: {
        width: 150,
        height: 100,
        margin: 4,
    }
});