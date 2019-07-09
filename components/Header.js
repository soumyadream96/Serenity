import React, { Component } from 'react';
import { withTheme, Searchbar, IconButton } from "react-native-paper";
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import { updateQuery } from '../actions';

class Header extends Component {

    state = {
        query: ''
    }

    handleChange = (text) => {
        this.setState({ query: text }); 
        this.props.updateQuery(text)
    }
    

    render() {
        const { colors } = this.props.theme;
        const { navigation } = this.props;

        return (
            <View style={{ backgroundColor: colors.background }}>
                <Searchbar
                    placeholder="Artists, songs or podcasts"
                    onChangeText={(text) => this.handleChange(text)}
                    value={this.state.query}
                    // clearIcon={() => <IconButton
                    //     icon="clear"
                    //     // color={Colors.red500}
                    //     // size={20}
                    //     // onPress={() => }
                    // />}
                    // onIconPress={() => this.props.navigation.toggleDrawer()}
                    icon="search"
                    style={{ margin: 10 }}
                />
            </View>
        )
    }
}


export default connect(null, { updateQuery })(withNavigation(withTheme(Header)));