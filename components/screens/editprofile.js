import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';


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
      hasPermission: null,
      type: Camera.Constants.Type.back

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
        <Text style= {{color: 'white'}}>First Name</Text>
        <TextInput 
        placeholder = {this.state.allinfo.first_name}
        onChangeText={(first_name) => this.setState({first_name})}
        defaultValue = {this.state.allinfo.first_name}
        style={{padding:5, borderWidth:1, margin:5}}
        borderColor= "white"
        color= 'white'
        />
         <Text style= {{color: 'white'}}>Last Name</Text>
        <TextInput 
        placeholder = {this.state.allinfo.last_name}
        onChangeText={(last_name) => this.setState({last_name})}
        defaultValue = {this.state.allinfo.last_name}
        style={{padding:5, borderWidth:1, margin:5}}
        borderColor= "white"
        color= 'white'
        />
         <Text style= {{color: 'white'}}>Email</Text>
        <TextInput 
        placeholder = {this.state.allinfo.email}
        onChangeText={(email) => this.setState({email})}
        defaultValue = {this.state.allinfo.email}
        style={{padding:5, borderWidth:1, margin:5}}
        borderColor= "white"
        color= 'white'
        
        />
        <Text style= {{color: 'white'}}>Password</Text>  
        <TextInput
        placeholder = "Enter new password..."
        onChangeText={(password) => this.setState({password})}
        style={{padding:5, borderWidth:1, margin:5}}
        secureTextEntry={true}
        borderColor= "white"
        color= 'white'
        placeholderTextColor= 'white'
        />
        <View style = {styles.button}>
        <Button
        title="Update"
        color="purple"
        onPress={() => {
            this.profileUpdate()
            this.props.navigation.navigate("Home")
        }
        }
        />
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
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'flex-start',
      backgroundColor: 'rgb(32,32,32)',
    },

    button: {
      flex: 1,
      //width: 150,
      //height: 150,
      flexWrap: 'wrap',
      //flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'flex-start',
      //gap: 10
        
    },

});

export default EditProfileScreen;