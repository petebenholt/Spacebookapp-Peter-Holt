import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class EditProfileScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      //isLoading: true,
      allinfo: {},
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getProfile();
  };
  
  componentWillUnmount() {
    this.unsubscribe();
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };
  
  getProfile = async() => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + value2, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': value
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            //isLoading: false,
            allinfo: responseJson,
            first_name: this.state.allinfo.first_name,
            last_name: this.state.allinfo.last_name,
            email: this.state.allinfo.email,
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  profileUpdate = async () => {
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + UserIDvalue, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionvalue
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        first_name: this.state.first_name,
        last_name: this.state.last_name
      
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          //isLoading: false,
          allinfo: responseJson
          })
        })
      .catch((error) => {
          console.log(error);
    });
  }
  
  render(){
    return (
      <View style={styles.container}>
        <TextInput 
        placeholder = {this.state.allinfo.first_name}
        onChangeText={(first_name) => this.setState({first_name})}
        defaultValue = {this.state.allinfo.first_name}
        style = {styles.inputStyle}
        />

        <TextInput 
        placeholder = {this.state.allinfo.last_name}
        onChangeText={(last_name) => this.setState({last_name})}
        defaultValue = {this.state.allinfo.last_name}
        style = {styles.inputStyle}
        />

        <TextInput 
        placeholder = {this.state.allinfo.email}
        onChangeText={(email) => this.setState({email})}
        defaultValue = {this.state.allinfo.email}
        style = {styles.inputStyle}
        />
            
        <TextInput
        placeholder = "Enter new password"
        onChangeText={(password) => this.setState({password})}
        style = {styles.inputStyle}
        secureTextEntry={true}
        />

        <Button
        style = {styles.button}
        title="Update"
        onPress={() => {
            this.update()
            this.props.navigation.navigate("Home")
        }
        }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start' 
    },

    button: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center'
        
    },

});

export default EditProfileScreen;