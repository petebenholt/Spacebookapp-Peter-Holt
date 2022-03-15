import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, ScrollView, Button, TextInput } from 'react-native';
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
      password: "",

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
    return fetch('http://localhost:3333/api/1.0.0/user/' + value2, {
        method: 'GET',
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
    return fetch('http://localhost:3333/api/1.0.0/user/' + UserIDvalue, {
      method: 'PATCH',
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
        <Text style= {styles.textDetails}>First Name</Text>
        <TextInput
        style = {styles.textInput}
        placeholder = {this.state.allinfo.first_name}
        onChangeText={(first_name) => this.setState({first_name})}
        defaultValue = {this.state.allinfo.first_name}
        />
         <Text style= {styles.textDetails}>Last Name</Text>
        <TextInput 
        style = {styles.textInput}
        placeholder = {this.state.allinfo.last_name}
        onChangeText={(last_name) => this.setState({last_name})}
        defaultValue = {this.state.allinfo.last_name}
        //style={{padding:5, borderWidth:1, margin:5, borderRadius: 8}}
        //borderColor= "white"
        //color= 'white'
        
        />
         <Text style= {styles.textDetails}>Email</Text>
        <TextInput style = {styles.textInput}
        //placeholderTextColor= "white"
        placeholder = {this.state.allinfo.email}
        onChangeText={(email) => this.setState({email})}
        defaultValue = {this.state.allinfo.email}
        />
        <Text style= {styles.textDetails}>Password</Text>  
        <TextInput
        style = {styles.textInput}
        placeholder = "Enter new password..."
        onChangeText={(password) => this.setState({password})}
        secureTextEntry={true}
       
        
        />
        <View style = {styles.updateButtons}>
        <Button
        title="           Update           "
        color="purple"
        onPress={() => {
            this.profileUpdate()
            this.props.navigation.navigate("Home")
        }
        }
        />
        <Text>  </Text>
        <Button
        title="Edit Profile Picture"
        color="purple"
        onPress={() => {
            this.props.navigation.navigate("Edit Profile Picture")
        }
        }
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(32,32,32)',
    },

    updateButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10
        
    },
    textDetails:{
      color: 'white'

    },
    textInput:{
      padding:5,
      borderWidth:1,
      margin:5,
      borderRadius: 8,
      borderColor: 'white',
      color: 'white',
      placeholderTextColor: 'white'
    },

});

export default EditProfileScreen;