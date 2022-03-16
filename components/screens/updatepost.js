import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class EditPost extends Component {
  constructor(props){
    super(props);

    this.state = {
      post: {},
      postText: ""
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getPosted();
  };


  componentWillUnmount() {
    this.unsubscribe();
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };


  

  getPosted = async() => {
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const postid = await AsyncStorage.getItem('postid');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    console.log("hello")
    return fetch('http://localhost:3333/api/1.0.0/user/'+UserIDvalue+'/post/'+postid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionvalue
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          post: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  updatePost = async () => {
    const UserID = await AsyncStorage.getItem('@user_id');
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const postid = await AsyncStorage.getItem('postid');
    return fetch("http://localhost:3333/api/1.0.0/user/"+UserID+"/post/"+postid, {
          method: 'PATCH',
          headers: {
          'X-Authorization':  sessionvalue,
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: this.state.postText
          })
        })
        .then((response) => {
            if(response.status === 200){
                return console.log("OK")
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
          })
          .then((res) => {
            this.props.navigation.navigate("Home");
          })
        .catch((error) => {
            console.log(error);
        })
  }



  render() {
    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgb(32,32,32)',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style = {styles.loadingText}>Loading..</Text>
        </View>
      );
    }else{
    return (
      <View style = {styles.container}>
        <Text style = {styles.previousText}>Previous Text: {this.state.post.text}</Text>
        <TextInput
            placeholder="Edit Your Post..."
            placeholderTextColor= 'white'
            multiline = {true}
            onChangeText={(postText) => this.setState({postText})}
            value={this.state.postText}
            style= {styles.editTextInput}
          />
          <Button 
          title = 'Edit Post'
          color='purple'
          onPress={() => this.updatePost()}
          />
      </View>
      );
  
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(32,32,32)',
  },
  
  loadingText:{
    color: 'white'
  },
  editTextInput:{
    padding:5,
    borderWidth:1,
    margin:5,
    borderRadius: 8,
    borderColor: 'white',
    color: 'white',
    placeholderTextColor: 'white'
  },
  previousText:{
    color: 'white'


  }
})

export default EditPost;