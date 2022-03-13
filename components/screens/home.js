import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      postData: {},
      postText: '',
      postedData: {},
      friendsdata: {},
      friendsUserIDs: [],
      allposted: {},
      friendidjson: {}
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getPosted();
    this.getFriendsList();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  postAPost = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    console.log(this.state.postText);
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+value2+"/post", {
      method: 'post',
      'headers': {
          'Content-Type': 'application/json',
          'X-Authorization':  value
          },
          body: JSON.stringify({
            text: this.state.postText
          })
      })
        .then((response) => {
            if(response.status === 201){
                console.log("created");
                return response.json()
            }else if(response.status === 401){
              console.log("unauth");
            }else if(response.status === 404){
              console.log("not found");
            }else if(response.status === 500){
              console.log("server error");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            postData: responseJson
          })
        console.log(this.state.postData)
        })
        .catch((error) => {
            console.log(error);
        })
  }






  getPosted = async() => {
    console.log("getting")
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    let friendsID = this.state.friendidjson;

    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+UserIDvalue+'/post', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionvalue
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        //console.log(responseJson);
        this.setState({
          //isLoading: false,
          postedData: responseJson
          
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }


  getFriendsList = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    //console.log(value2)
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+value2+"/friends", {
      method: 'get',
      headers: {
          'Content-Type': 'application/json',
          'X-Authorization':  value
          },
      })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            friendsdata: responseJson
          })
          //console.log(this.state.friendsdata);
          this.getUserIDs();
        })

        .catch((error) => {
            console.log(error);
        })
  }

  getUserIDs = async () => {
    let friendsdata = this.state.friendsdata;
    const value2 = await AsyncStorage.getItem('@user_id');
    
    for (let i = 0; i < friendsdata.length; i++) {
      this.state.friendsUserIDs.push(friendsdata[i].user_id);
    }
    console.log(this.state.friendsUserIDs);
    for (let i = 0; i < this.state.friendsUserIDs.length; i++) {
      //this.getPosted(this.state.friendsUserIDs[i]);
      this.state.friendidjson = JSON.stringify(this.state.friendsUserIDs);
    }
    console.log(this.state.friendidjson);
  }










  likePost = async(postID)=>{
    const value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem("@session_id");
      
    return fetch(this.state.postLink+"/user/"+id+"/post/"+postID+"/like",{
      method:"POST",
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
      console.log(responseJson);
    })
    .catch((error) => {
        console.log(error);
    }) 
  }





  render() {
      return (
        <View style= {styles.container}>
          <Button
          title = 'Profile'
          color='purple'
          onPress={() => 
            {this.getPosted(); 
            this.props.navigation.navigate("Profile")
          }}
          />
          <Button
          title = 'Friends'
          color='purple'
          onPress={() => this.props.navigation.navigate("Friends")}

          />
          <TextInput
            placeholder="Enter Your Post..."
            placeholderTextColor= 'white'
            color= 'white'
            multiline = {true}
            onChangeText={(postText) => this.setState({postText})}
            value={this.state.postText}
            style={{padding:5, borderWidth:1, margin:5}}
            borderColor= "white"
          />
          <View style= {styles.buttonstyle}>
          <Button 
          title = 'Add Post'
          color='purple'
          onPress={() => this.postAPost()}
          />
          </View>
          <FlatList
            data={this.state.postedData}
            keyExtractor={(item,index) => item.post_id.toString()}
            renderItem={({item}) => (
            <View style= {styles.listbox}>
              <Text style = {{color: 'black'}}>
              {item.author.first_name} {item.author.last_name} </Text>
              <Text>Date:{item.timestamp}</Text>

              <Text>{item.text}</Text>
              <Text>Likes: {item.numLikes}</Text>
              <View style= {styles.likesbutton}>
              <Button
                title='Like'
                color='purple'
                onPress={() => this.likePost(item.post_id)}
              />
              <Button
                title='Dislike'
                color='red'
              />
              </View>
            </View>
              )}
            />

        </View>
      );
    }
    
  
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(32,32,32)',
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
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      flexDirection: 'row',
      marginRight:10,
    },


  })

export default HomeScreen;