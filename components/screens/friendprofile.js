import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




class FriendsProfileScreen extends Component {
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
    //this.getProfilePic();
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
    const otheruserID = await AsyncStorage.getItem('other-user_id');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/' + otheruserID, {
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
  
  // getProfilePic = async () => {
  //   console.log("get profpic");
  //   const sessionvalue = await AsyncStorage.getItem('@session_token');
  //   const UserIDvalue = await AsyncStorage.getItem('@user_id');
  //   fetch("http://10.0.2.2:3333/api/1.0.0/user/" + UserIDvalue +"/photo", {
  //     method: 'get',
  //     headers: {
  //       'X-Authorization': sessionvalue
  //     }
  //   })
  //   .then((res) => {
  //     return res.blob();
  //   })
  //   .then((resBlob) => {
  //     let data = URL.createObjectURL(resBlob);
  //     this.setState({
  //       pfp: data,
  //       isLoading: false
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   });
  // }

  getPosted = async() => {
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    const otheruserID = await AsyncStorage.getItem('other-user_id');
    return fetch('http://10.0.2.2:3333/api/1.0.0/user/'+otheruserID+'/post', {
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
          //isLoading: false,
          postedData: responseJson
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


  ViewPost = async(postID, otherfriendid,friendfirstname, friendlastname)=>{
    await AsyncStorage.setItem('postid', postID.toString());
    await AsyncStorage.setItem('otherfriendid', otherfriendid.toString());
    await AsyncStorage.setItem('friendFirstName', friendfirstname.toString());
    await AsyncStorage.setItem('friendLastName', friendlastname.toString());
    this.props.navigation.navigate("Friend's Post");
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
        <Image
          source={{uri: this.state.pfp}}
        />
        <View style= {styles.profileBox}>
        <Text style= {styles.profileText}> {this.state.info.first_name} {this.state.info.last_name}</Text>
        <Text style= {styles.profileText}> {this.state.info.email}</Text>
        <Text style= {styles.profileText}> Friends: {this.state.info.friend_count}</Text>
        </View>
        <View style = {styles.postTextBox}>
        <Text style= {styles.userPostsText}>{this.state.info.first_name}'s Posts</Text>
        </View>
        <FlatList
            data={this.state.postedData}
            keyExtractor={(item,index) => item.post_id.toString()}
            renderItem={({item}) => (
            <View style= {styles.listbox}>
              <Text style = {styles.postText}>
              {item.author.first_name} {item.author.last_name} </Text>
              <Text style = {styles.postText}>{this.dateParser(item.timestamp)}</Text>
              <Text>   </Text>
              <Text styles= {styles.postText}> {item.text} </Text>
              <Text>   </Text>
              <Text style = {styles.postText}>Likes: {item.numLikes}</Text>
              <View style= {styles.postButtons}>
              <Button
                title='Like'
                color='purple'
                onPress={() => this.likePost(item.post_id, item.author.user_id)}
              />
              <Button
                title='Dislike'
                color='red'
                onPress={() => this.unlikePost(item.post_id, item.author.user_id)}
              />
              <Button
                title='View Post'
                color='purple'
                onPress={() => this.ViewPost(item.post_id, item.author.user_id, item.author.first_name, item.author.last_name)}
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
    backgroundColor: 'white',
    padding: 10,
  },
  profileText: {
    color: 'white',
    fontSize: 18,

  },
  profileBox: {
    backgroundColor: 'rgb(32,32,32)',
    //borderRadius: 15

  },
  userPostsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    justifyContent: 'center',
  },
  postText: {
    color: 'black',
    //fontWeight: 'bold',
    //fontSize: 24,
    justifyContent: 'center',
  },
  postTextBox: {
   marginLeft: 130,
  },
  listbox: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15
  },
  buttonstyle: {
    marginBottom: 10,
  },
  postButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight:10,
  },
  image: {
    backgroundColor: 'black',
  },

})

export default FriendsProfileScreen;