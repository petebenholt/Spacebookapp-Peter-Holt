import React, { Component } from 'react';
import { Text, Button, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class LogoutScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            info: {}
        }
    }

  componentDidMount(){
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
    }); 
  this.getProfile();
  }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    logout = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'POST',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200 ){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    getProfile = async() => {
      const sessiontoken = await AsyncStorage.getItem('@session_token');
      const userid = await AsyncStorage.getItem('@user_id');
      return fetch('http://localhost:3333/api/1.0.0/user/'+userid, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'X-Authorization': sessiontoken
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson);
          this.setState({
              //isLoading: false,
              info: responseJson
          })
      })
      .catch((error) => {
          console.log(error);
      });
    }
    render(){
        return (
            <View style= {styles.container}>
                <Text style = {styles.goodbyeText}>Goodbye, {this.state.info.first_name}!</Text>
                <View style ={styles.buttons}>
                <Button
                    title="Logout"
                    color= "purple"
                    onPress={() => this.logout()}
                />
                <Button
                    title="Cancel"
                    color="black"
                    onPress={() => this.props.navigation.navigate("Home")}
                />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(32,32,32)',
    justifyContent:'center',
    
  },
  goodbyeText: {
    color: 'white',
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    justifyContent: 'center',
    marginBottom: 150
  }
 
})



export default LogoutScreen;