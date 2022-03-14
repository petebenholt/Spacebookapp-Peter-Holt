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
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getPosted();
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
    const sessiontoken = await AsyncStorage.getItem('@session_token');
    const UserID = await AsyncStorage.getItem('@user_id');
    console.log(this.state.postText);
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+UserID+"/post", {
      method: 'post',
      'headers': {
          'Content-Type': 'application/json',
          'X-Authorization':  sessiontoken
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
          this.getPosted();
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

  dateParser = (date)=>{
    let unixdate = Date.parse(date);
    let dateString = new Date(unixdate).toLocaleDateString("en-UK")
    let timeString = new Date(unixdate).toLocaleTimeString("en-UK");
    let finalDate = dateString+ " " + timeString
    return finalDate
    
  }

  render() {
      return (
        <View style= {styles.container}>
          <View style= {styles.navButtons}>
          <Button
          title = 'Profile'
          color='purple'
          onPress={() => 
            {this.getPosted(); 
            this.props.navigation.navigate("Profile")
          }}
          />
          <View><Text>  </Text></View>
          <Button
          title = 'Friends'
          color='purple'
          onPress={() => this.props.navigation.navigate("Friends")}
          />
          </View>
          <TextInput
            placeholder="Enter Your Post..."
            placeholderTextColor= 'white'
            color= 'white'
            multiline = {true}
            onChangeText={(postText) => this.setState({postText})}
            value={this.state.postText}
            style={{padding:5, borderWidth:1, margin:5, borderRadius: 8}}
            borderColor= "white"
          />
          <View style= {styles.postButton}>
          <Button 
          title = 'Add Post'
          color='purple'
          onPress={() => this.postAPost()}
          />
          </View>
          <View style = {styles.postTextBox}>
        
          <Text style= {styles.postText}>Your Posts</Text>
          </View>
          <FlatList
            data={this.state.postedData}
            keyExtractor={(item,index) => item.post_id.toString()}
            renderItem={({item}) => (
            <View style= {styles.listbox}>
              <Text style = {{color: 'black'}}>
               {item.author.first_name} {item.author.last_name}</Text>
              <Text>{this.dateParser(item.timestamp)}</Text>
              <Text></Text>
              <Text>{item.text}</Text>
              <Text></Text>
              <Text>Likes: {item.numLikes}</Text>
              <View style= {styles.likesbutton}>
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
      marginBottom: 10,
      borderRadius: 15

    },
    postButton: {
      marginBottom: 1,
      flexDirection: "row",
      justifyContent: "center"
      
    },
    navButtons: {
      flexDirection: "row",
      justifyContent: "flex-start",
      
    },
    postText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 24,
      justifyContent: 'center',
    },
    postTextBox: {
      marginLeft: 140,
     },
  })

export default HomeScreen;