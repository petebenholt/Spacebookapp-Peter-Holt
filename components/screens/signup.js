import { alignProperty } from '@mui/material/styles/cssUtils';
import React, { Component } from 'react';
import { Button, TextInput, StyleSheet, View } from 'react-native';

class SignupScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => {
        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        })
    }

  render(){
      return (
        <View style = {styles.container}>
        <TextInput
            placeholder="Enter your first name..."
            onChangeText={(first_name) => this.setState({first_name})}
            value={this.state.first_name}
            placeholderTextColor= "white"
            borderColor= "white"
            style ={styles.TextInput}
        />
        <TextInput
            placeholder="Enter your last name..."
            onChangeText={(last_name) => this.setState({last_name})}
            placeholderTextColor= "white"
            value={this.state.last_name}
            borderColor= "white"
            style ={styles.TextInput}
        />
        <TextInput
            style ={styles.TextInput}
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            placeholderTextColor= "white"
            borderColor= "white"
            
        />
        <TextInput
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry = {true}
            placeholderTextColor= "white"
            borderColor= "white"
            style ={styles.TextInput}
            
        />
        <View style= {styles.button}>
        <Button
            title="Create account"
            onPress={() => this.signup()}
            color= "purple"
        />
        </View>
              
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(32,32,32)',
  },
  TextInput: {
    color: 'white',
    padding:5,
    borderWidth:1,
    margin:5,
    borderRadius: 8
  },
  button: {
    justifyContent: "center",
    flexDirection: "row"

  }


})

export default SignupScreen;