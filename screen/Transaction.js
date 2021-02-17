import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import * as Firebase from 'firebase';
import db from './config.js'
// You can import from local files

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

export default class Transaction extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      buttonState: 'normal',
      scannedBookId: '',
      scannedStudentId: '',
      transactionMessage:''
    };
  }

  getCamerPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
      buttonState: id,
      scanned: false,
    });
  };
  handleBarCodeScanned = async ({ type, data }) => {
    if (this.state.buttonState === 'StudentID') {
      this.setState({
        scanned: true,
        buttonState: 'normal',
        scannedStudentId: data,
      });
    }
    if (this.state.buttonState === 'BookID') {
      this.setState({
        scanned: true,
        buttonState: 'normal',
        scannedBookId: data,
      });
    }
  };
  initiateBookIssue = async()=>{
    db.collection("transaction").add({
      studentId: this.state.scannedStudentId,
      bookId:this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType:'issue'  
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      bookAvailability: false
    });
    db.collection("students").doc(this.state.scannedStudentId).update({
      numberOfBooksIssued: firebase.firestore.FieldValue.increment(1) 
    });
    this.setState({
      scannedBookId:"",
      scannedStudentId:""
    });
    Alert.alert("Book Issued");
  };
  
  initiateBookReturn = async()=>{
    db.collection("transaction").add({
      studentId: this.state.scannedStudentId,
      bookId:this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType:'return'  
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      bookAvailability: true
    });
    db.collection("students").doc(this.state.scannedStudentId).update({
      numberOfBooksIssued: firebase.firestore.FieldValue.increment(-1) 
    });
    this.setState({
      scannedBookId:"",
      scannedStudentId:""
    });
    Alert.alert("Book Returned");
  };
  handleTransaction = ()=>{
    var transactionMessage = null;
    db.collection("books").doc(this.state.scannedBookId).get()
    .then(
      (doc)=>{
        var book = doc.data();
        if(book.bookAvailability){
          transactionMessage = "Book Issued";
          this.initiateBookIssue();
        }else {
          transactionMessage = "Book Returned";
          this.initiateBookReturn();
        }
      }
    )
    this.setState({transactionMessage: transactionMessage});
    
  }

  render() {
    const hasCameraPermission = this.state.hasCameraPermission;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (hasCameraPermission && buttonState === 'clicked') {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Text>Transaction</Text>
        <View style={styles.view}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              this.setState({ scannedData: text });
            }}
            value={this.state.scannedData}
            placeholder="Book ID"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={this.getCamerPermission('BookID')}>
            <Text>Scan</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.view}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              this.setState({ scannedData: text });
            }}
            value={this.state.scannedData}
            placeholder="Student ID"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={this.getCamerPermission('StudentID')}>
            <Text>Scan</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.submit}
          onPress={this.handleTransaction}>
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    color: 'black',
    borderColor: 'black',
    borderWidth: 2.5,
    height: 25,
    width: 200,
    alignContent: 'center',
  },
  button: {
    backgroundColor: 'red',
    width: 50,
    height: 25,
    alignContent: 'center',
  },
  view: {
    flexDirection: 'row',
    marginTop: 30,
  },
  submit: {
    marginTop: 30,
    marginLeft: 50,
    backgroundColor: 'blue',
    width: 70,
    height: 30,
  },
  text: {
    alignSelf: 'center',
  },
});
