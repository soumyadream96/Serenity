import React, { Component } from 'react';
import { View } from 'react-native';
import { List, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import _ from 'lodash'

class Playlist extends Component {
    static navigationOptions = {
        header: null
    };

    state={
        favorite: []
    }

    static getDerivedStateFromProps(props, state) {
        if(!_.isEqual(props.favorite,state.favorite)){
            return {
                favorite: props.favorite
            }
        }
        return null
    }


    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.favorite) {
    //         this.setState({ favorite: nextProps.favorite });
    //     }
    // }

    render() {
        const { navigate } = this.props.navigation;
        const { colors } = this.props.theme;
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <List.Item
                    title="Create Playlist"
                    left={props => <List.Icon {...props} icon="add" />}
                />
                <List.Item
                    title="Favorite"
                    description={_.size(this.state.favorite)+" Favorite Songs"}
                    left={props => <List.Icon {...props} icon="favorite" />}
                    onPress={() => { 
                        _.isEmpty(this.state.favorite) ? null :  
                        navigate('Songs', 
                            { 
                                songs: this.state.favorite, 
                                img: "https://source.unsplash.com/collection/403065/120x120", 
                                title: "Favorites" 
                            }
                        )
                    }}
                />
                <List.Item
                    title="My Fav"
                    description="by you"
                    left={props => <List.Icon {...props} icon="audiotrack" />}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    favorite: state.media.favorite
});

export default connect(mapStateToProps)(withTheme(Playlist));
