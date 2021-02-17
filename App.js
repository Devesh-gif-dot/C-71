import React, { Component } from 'react';
import { Text, View, StyleSheet, Button,Image } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// You can import from local files
import SearchScreen from './screen/searchScreen';
import Transaction from './screen/Transaction';

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Appcontainer />
      </View>
    );
  }
}

const tabContainer = createBottomTabNavigator({
  Trans: Transaction,
  Search: SearchScreen,
},
{
  defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
    const routeName = navigation.state.routeName
    if(routeName==='Trans'){
      return(<Image style={styles.imge} 
      source={require('./assets/book.png')}/>)
    } else if(routeName==='Search'){
      return(<Image style={styles.imge}
      source={require('./assets/booklogo.jpg')}/>)
    }
  }
})
})
const Appcontainer = createAppContainer(tabContainer);

const styles = StyleSheet.create({
  imge:{
    width:30,
    height:30
  }
})