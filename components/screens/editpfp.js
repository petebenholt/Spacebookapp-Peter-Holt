import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';


class EditProfilePicture extends Component{
  constructor(props){
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
      data: null
    }
  }

  async componentDidMount(){
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  sendToServer = async (data) => {
      // Get these from AsyncStorage
      console.log("hello")
      const sessionvalue = await AsyncStorage.getItem('@session_token');
      const UserIDvalue = await AsyncStorage.getItem('@user_id');
      console.log("success")

      let res = await fetch(data.base64);
      let blob = await res.blob();
      console.log("success2")

      return fetch("http://192.168.0.17:3333/api/1.0.0/user/"+UserIDvalue+"/photo", {
          method: "POST",
          headers: {
              "Content-Type": "image/png",
              "X-Authorization": sessionvalue
          },
          body: blob
      })
      .then((response) => {
          console.log("Picture added", response);
      })
      .catch((err) => {
          console.log(err);
      })
  }

    takePicture = async () => {
        if(this.camera){
            const options = {
                quality: 0.5, 
                base64: true,
                onPictureSaved: (data) => this.sendToServer(data)
            };
            await this.camera.takePictureAsync(options);
        } 
    }

  render(){
    if(this.state.hasPermission){
      return(
        <View style={styles.container}>
          <Camera 
            style={styles.camera} 
            type={this.state.type}
            ref={ref => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}> Take Photo </Text>
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
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default EditProfilePicture;