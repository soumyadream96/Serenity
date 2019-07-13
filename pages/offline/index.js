import React, { Component } from 'react';
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import { DarkTheme } from 'react-native-paper';

import AlbumScreen from './Album';
import ArtistScreen from './Artist';
import Song from './Song';
import FilterScreen from '../shared/Filter';

const ArtistStack = createStackNavigator({
    Artist: ArtistScreen
})

const AlbumStack = createStackNavigator({
    Album: AlbumScreen
})


const TabNavigator =  createMaterialTopTabNavigator({
    Song: { screen: Song },
    Artist: { screen: ArtistStack },
    Album: { screen: AlbumStack },
}, {
        tabBarOptions: {
            labelStyle: {
                fontSize: 14,
            },
            tabStyle: {
                width: 100,
            },
            indicatorStyle: {
                backgroundColor: DarkTheme.colors.primary
            },
            style: {
                backgroundColor: DarkTheme.colors.surface,
            },
        }
});

export default createStackNavigator({
        Tabs: {
            screen: TabNavigator,
            navigationOptions: {
                header: null
            }
        },
        Filter: FilterScreen
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: DarkTheme.colors.surface,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: DarkTheme.colors.text
            },
        },
    }
)
