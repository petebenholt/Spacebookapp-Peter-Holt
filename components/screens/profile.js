import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: [],
      newlist: [],
      info: {},
      pfp: null,
      postedData: []

    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getProfile();
    this.getProfilePic();
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
    fetch("http://10.0.2.2:3333/api/1.0.0/user/" + UserIDvalue +"/photo", {
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

  getPosted = async() => {
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

  deletePosted = async(postid) => {
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+UserIDvalue+'/post/'+postid, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionvalue
        }
    })
    .then((response) => {
        //console.log(response);
        this.getPosted();
        //console.log("success")
        // this.setState({
        //   //isLoading: false,
        //   //postedData: responseJson
        // })
    })
    .then(() =>{
      
      
    })
    .catch((error) => {
        console.log(error);
    });
  }

  editPosted = async(postid) => {
    await AsyncStorage.setItem('postid', postid.toString());
    this.props.navigation.navigate("Edit Post")
  }



  render() {
    return (
      <View style= {styles.container}>
        <Image
          source={{uri: this.state.pfp}}
        />
        <Text style= {styles.text}>Name: {this.state.info.first_name} {this.state.info.last_name}</Text>
        <Text style= {styles.text}>Email: {this.state.info.email}</Text>
        <Text style= {styles.text}>Friends: {this.state.info.friend_count}</Text>
        <Button
          title="Edit"
          color= "purple"
          onPress={() => this.props.navigation.navigate("Edit Profile")}
        />
        <Button
          title="Logout"
          color= "purple"
          onPress={() => this.props.navigation.navigate("Logout")}
        />
        <Text style= {styles.text2}>Your Posts</Text>
        <FlatList
            data={this.state.postedData}
            extraData={this.props}
            keyExtractor={(item,index) => item.post_id.toString()}
            renderItem={({item}) => (
            <View style= {styles.listbox}>
              <Text style = {styles.text3}>
              {item.author.first_name} {item.author.last_name} </Text>
              <Text style = {styles.text3}>Date:{item.timestamp}</Text>
              <Text>   </Text>
              <Text styles= {styles.text3}> {item.text} </Text>
              <Text>   </Text>
              <Text style = {styles.text3}>Likes: {item.numLikes}</Text>
              <View style= {styles.likesbutton}>
              <Button
                title = "Edit Post"
                color = "blue"
                onPress={() => this.editPosted(item.post_id)}
              />
              <Button
                title = "Delete Post"
                color = "red"
                onPress={() => this.deletePosted(item.post_id)}
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

export default ProfileScreen;