import React, { Component } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator} from 'react-navigation-tabs';

// You can import from local files

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

export default class SearchScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
       <Text>Search Screen</Text>
      </View>
    );
  }
}
