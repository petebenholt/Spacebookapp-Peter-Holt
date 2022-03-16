import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      postData: {},
      postText: '',
      postedData: {},
      pfp: null,
      info: {},
      isLoading: true
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getPosted();
    this.getProfilePic();
    this.getProfile();
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
    return fetch("http://localhost:3333/api/1.0.0/user/"+UserID+"/post", {
      method: 'POST',
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

    return fetch('http://localhost:3333/api/1.0.0/user/'+UserIDvalue+'/post', {
        method: 'GET',
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

  getProfile = async() => {
    const sessiontoken = await AsyncStorage.getItem('@session_token');
    const UserID = await AsyncStorage.getItem('@user_id');
    return fetch('http://localhost:3333/api/1.0.0/user/' + UserID, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessiontoken
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        this.setState({
            isLoading: false,
            info: responseJson
        })
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getProfilePic = async () => {
    console.log("get profpic");
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    fetch("http://localhost:3333/api/1.0.0/user/" + UserIDvalue +"/photo", {
      method: 'get',
      headers: {
        'X-Authorization': sessionvalue
      }
    })
    .then((response) => {
      return response.blob();
    })
    .then((resBlob) => {
      const data = URL.createObjectURL(resBlob);
      this.setState({
        pfp: data,
        isLoading: false
      });
    })
    .catch((error) => {
      console.log(error)
    });
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
        <View style= {styles.container}>
          <View style= {styles.imagecontainer}>
          <Image style = {styles.image}
          source={{uri: this.state.pfp}}
          />
          <Text style = {styles.profileInfo}>{this.state.info.first_name} {this.state.info.last_name}</Text>
          <Text style = {styles.profileInfo}>Friend Count: {this.state.info.friend_count}</Text>
          <View styles = {styles.navButtons}>
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
          <Button
          title = 'Logout'
          color='purple'
          onPress={() => this.props.navigation.navigate("Logout")}
          />
          </View>
          </View>
          <View>
          <TextInput
            style={styles.postTextInput}
            placeholder="Enter Your Post..."
            multiline = {true}
            onChangeText={(postText) => this.setState({postText})}
            value={this.state.postText}
            numberOfLines = "5"
            
          />
          <View style= {styles.postButton}>
          <Button 
          title = 'Add Post'
          color='purple'
          onPress={() => this.postAPost()}
          />
          </View>
          </View>
          <View style = {styles.postTextBox}>
          <Text style= {styles.postText}>Your Posts</Text>
          </View>
          <View style = {styles.postsection}>
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
        </View>
      );
    }
  }
  
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(32,32,32)',
    },
    profilecontainer:{
      justifyContent: 'flex-start',
    },
    profileInfo: {
      color: 'white'
    },
    navButtons: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    listbox: {
      padding: 20,
      backgroundColor: 'white',
      marginBottom: 10,
      borderRadius: 15,
      marginRight: 5,
      marginLeft: 5,
    },
    postButton: {
      marginBottom: 1,
      flexDirection: "row",
      justifyContent: "center"
    },
    postTextInput:{
      padding:5,
      borderWidth:1,
      margin:5,
      borderRadius: 8,
      borderColor: 'white',
      color: 'white',
      placeholderTextColor: 'white'
    
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
    image: {
      backgroundColor: 'purple',
      borderWidth: 1,
      maxWidth:'25%',
      minWidth:'25%',
      minHeight:'100%'
    },
    imagecontainer: {
      backgroundColor: ('rgb(32,32,32)'),
      flexDirection:'row',
      flex:1,
      justifyContent:'space-between',
      alignItems:'center',
      padding:5,
      minHeight:'13%',
      
    },
    postsection:{
      flex: 8
    },
    loadingText:{
    color: 'white'
  },
  })

export default HomeScreen;