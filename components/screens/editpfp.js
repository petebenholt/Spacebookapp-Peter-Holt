import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';


class EditProfilePicture extends Component {
  constructor(props){
    super(props);
    this.state = {
      //isLoading: true,
      allinfo: {},
      hasPermission: null,
      type: Camera.Constants.Type.back

    }
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'})
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    
    });

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
  
  

 
  
    render(){
      if(this.state.hasPermission){
        return(
          <View style= {styles.button}>
            <Camera style= {styles.button}>
              <View>
                <TouchableOpacity
                  //style={styles.button}
                  onPress={() => {
                    let type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;
  
                    this.setState({type: type});
                  }}>
                  <Text> Flip </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  //this.takeAPhoto();
                }}
                >
                <Text> Take Photo </Text>
              </TouchableOpacity>
              </View>
            </Camera>
          </View>
        );
      }else{
        return(
          <Text>No access to camera</Text>
        );
      }
    }
  }
  



const styles = StyleSheet.create({
    container: {
        flex: 1,
       // flexDirection: 'column', 
        //justifyContent: 'flex-start', 
        //alignItems: 'flex-start' 
    },

    button: {
      flex: 1,
      padding:10
        
    },

});

export default EditProfilePicture;