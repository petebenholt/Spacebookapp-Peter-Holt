import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class ViewPost extends Component {
  constructor(props){
    super(props);

    this.state = {
      info: {}
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
    const otherfriendid = await AsyncStorage.getItem('otherfriendid');
    console.log("hello")
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+otherfriendid+'/post/'+postid, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionvalue
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          info: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }



  likePost = async(postID, otherfriendid)=>{
    const value = await AsyncStorage.getItem('@session_token');
    const UserID = await AsyncStorage.getItem('@user_id');
      
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+ otherfriendid +"/post/"+ postID +"/like",{
      method:"post",
      headers:{
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'already liked this post'
      }else if(response.status === 404){
        throw 'Not Found'
      }else if(response.status === 500){
        throw 'Server Error'
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.getPosted();
      console.log(responseJson);
    })
    
    .catch((error) => {
        console.log(error);
    }) 
  }

  unlikePost = async(postID, otherfriendid)=>{
    const value = await AsyncStorage.getItem('@session_token');
    const UserID = await AsyncStorage.getItem('@user_id');
      
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+ otherfriendid +"/post/"+ postID +"/like",{
      method:"delete",
      headers:{
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
      }else if(response.status === 401){
          throw 'Unauthorized'
      }else if(response.status === 403){
        throw 'already liked this post'
      }else if(response.status === 404){
        throw 'Not Found'
      }else if(response.status === 500){
        throw 'Server Error'
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.getPosted();
      console.log(responseJson);
    })
    
    .catch((error) => {
        console.log(error);
    }) 
  }

  render() {
    return (
      <View>
      {/* <Text>{this.state.info.author.first_name}</Text>
      <Text>{this.state.info.timestamp}</Text>
      <Text>{this.state.info.text}</Text>
      <Text>
        Likes:
        {' '}
        {this.state.postedData.numLikes}
      </Text> */}
    </View>
        
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(32,32,32)',
  },
  box: {
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  text2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    justifyContent: 'center',
  },
  text3: {
    color: 'black',
    //fontWeight: 'bold',
    //fontSize: 24,
    justifyContent: 'center',
  },
  feedtext: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 10,
    
  },
  textbox: {
   marginLeft: 130,
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding:1,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
  },
  listbox: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10

  },
  buttonstyle: {
    marginBottom: 10,
  },
  likesbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight:10,
  },
  image: {
    backgroundColor: 'black',


  },

})

export default ViewPost;