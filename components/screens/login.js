import React, { Component } from 'react';
import { View, Button, ScrollView, TextInput, StyleSheet, Text} from 'react-native';
//import {  ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = async () => {

        //Validation here...

        return fetch("http://10.0.2.2:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('@user_id', responseJson.id.toString());
                this.props.navigation.navigate("Home");
                
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        return (
            <View style= {styles.container}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                  <View style= {styles.box}>
                    <Text style= {styles.text}>Welcome To Spacebook</Text>
                    <TextInput
                        placeholder="Enter your email..."
                        placeholderTextColor= 'white'
                        color= 'white'
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        style={{padding:5, borderWidth:1, margin:5}}
                        borderColor= "black"
                    />
                    <TextInput
                        placeholder="Enter your password..."
                        placeholderTextColor= 'white'
                        color= 'white'
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry
                        borderColor= "black"
                        style={{padding:5, borderWidth:1, margin:5}}
                    />
                    <Button
                        title="Login"
                        color="rgb(32,32,32)"
                        onPress={() => this.login()}
                    />
                    <Button
                        title="Make an account?"
                        color="darkred"
                        onPress={() => this.props.navigation.navigate("Signup")}
                    />
                  </View>
                </ScrollView>
              </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(32,32,32)',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 55,
    fontSize: 24,
  },
  box: {
    backgroundColor: 'rgb(64,64,64)',
    padding: 20,

  }
})


export default LoginScreen;