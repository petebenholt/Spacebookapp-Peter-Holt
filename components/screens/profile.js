/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
      pfp: null,
      postedData: [],
      isLoading: true,

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getProfile();
    this.getProfilePic();
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

  getProfile = async () => {
    const sessiontoken = await AsyncStorage.getItem('@session_token');
    const UserID = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UserID}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessiontoken,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          info: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getProfilePic = async () => {
    console.log('get profpic');
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    fetch(`http://localhost:3333/api/1.0.0/user/${UserIDvalue}/photo`, {
      method: 'get',
      headers: {
        'X-Authorization': sessionvalue,
      },
    })
      .then((response) => response.blob())
      .then((resBlob) => {
        const data = URL.createObjectURL(resBlob);
        this.setState({
          pfp: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPosted = async () => {
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UserIDvalue}/post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionvalue,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          isLoading: false,
          postedData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deletePosted = async (postid) => {
    const UserIDvalue = await AsyncStorage.getItem('@user_id');
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${UserIDvalue}/post/${postid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionvalue,
      },
    })
      .then((response) => {
        this.getPosted();
        this.setState({
          isLoading: false,
        });
      })
      .then(() => {

      })
      .catch((error) => {
        console.log(error);
      });
  };

  editPosted = async (postid) => {
    await AsyncStorage.setItem('postid', postid.toString());
    this.props.navigation.navigate('Edit Post');
  };

  dateParser = (date) => {
    const unixdate = Date.parse(date);
    const dateString = new Date(unixdate).toLocaleDateString('en-UK');
    const timeString = new Date(unixdate).toLocaleTimeString('en-UK');
    const finalDate = `${dateString} ${timeString}`;
    return finalDate;
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgb(32,32,32)',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={styles.loadingText}>Loading..</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>

        <View style={styles.imagecontainer}>
          <Image
            style={styles.image}
            source={{ uri: this.state.pfp }}
          />
          <Text style={styles.text}>
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
          </Text>
          <Text style={styles.text}>{this.state.info.email}</Text>
          <Text style={styles.text}>
            Friends:
            {this.state.info.friend_count}
          </Text>
        </View>
        <View style={styles.button}>
          <Button
            title="Edit Profile"
            color="purple"
            onPress={() => this.props.navigation.navigate('Edit Profile')}
          />
          <Text />
          <Button
            title="Logout"
            color="purple"
            onPress={() => this.props.navigation.navigate('Logout')}
          />
        </View>
        <View style={styles.postscontainer}>
          <Text style={styles.text2}>Your Posts</Text>
          <FlatList
            data={this.state.postedData}
            extraData={this.props}
            keyExtractor={(item, index) => item.post_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.listbox}>
                <Text style={styles.text3}>
                  {item.author.first_name}
                  {' '}
                  {item.author.last_name}
                  {' '}

                </Text>
                <Text style={styles.text3}>{this.dateParser(item.timestamp)}</Text>
                <Text>   </Text>
                <Text styles={styles.text3}>
                  {' '}
                  {item.text}
                  {' '}
                </Text>
                <Text>   </Text>
                <Text style={styles.text3}>
                  Likes:
                  {item.numLikes}
                </Text>
                <View style={styles.likesbutton}>
                  <Button
                    title="  Edit Post  "
                    color="purple"
                    onPress={() => this.editPosted(item.post_id)}
                  />
                  <Text> </Text>
                  <Button
                    title="Delete Post"
                    color="red"
                    onPress={() => this.deletePosted(item.post_id)}
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(32,32,32)',
  },
  box: {
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
  },
  text: {
    color: 'white',
    // fontWeight: 'bold',
    fontSize: 12,
    marginRight: 10,
  },
  text2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    justifyContent: 'center',
  },
  text3: {
    color: 'black',
    // fontWeight: 'bold',
    // fontSize: 24,
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  listbox: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 15,
  },
  buttonstyle: {
    marginBottom: 10,
  },
  likesbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  image: {
    backgroundColor: 'purple',
    borderWidth: 1,
    maxWidth: '25%',
    minWidth: '25%',
    minHeight: '100%',
  },
  imagecontainer: {
    backgroundColor: ('rgb(32,32,32)'),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    minHeight: '13%',

  },
  postscontainer: {
    flex: 8,

  },
  loadingText: {
    color: 'white',
  },

});

export default ProfileScreen;
