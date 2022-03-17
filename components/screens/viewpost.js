/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: {},
      firstname: '',
      lastname: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getName();
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

  getPosted = async () => {
    const sessionvalue = await AsyncStorage.getItem('@session_token');
    const postid = await AsyncStorage.getItem('postid');
    const otherfriendid = await AsyncStorage.getItem('otherfriendid');
    console.log('hello');
    return fetch(`http://localhost:3333/api/1.0.0/user/${otherfriendid}/post/${postid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionvalue,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          post: responseJson,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  likePost = async (postID, otherfriendid) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${otherfriendid}/post/${postID}/like`, {
      method: 'POST',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          throw 'Liked';
        } else if (response.status === 401) {
          throw 'Unauthorized';
        } else if (response.status === 403) {
          throw 'Already liked this post';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.getPosted();
        console.log(responseJson);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  unlikePost = async (postID, otherfriendid) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${otherfriendid}/post/${postID}/like`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          throw 'Un-Liked';
        } if (response.status === 401) {
          throw 'Unauthorized';
        } else if (response.status === 403) {
          throw 'Already liked this post';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else if (response.status === 500) {
          throw 'Server Error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.getPosted();
        console.log(responseJson);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  dateParser = (date) => {
    const unixdate = Date.parse(date);
    const dateString = new Date(unixdate).toLocaleDateString('en-UK');
    const timeString = new Date(unixdate).toLocaleTimeString('en-UK');
    const finalDate = ` ${dateString} ${timeString}`;
    return finalDate;
  };

  getName = async () => {
    const firstname = await AsyncStorage.getItem('friendFirstName');
    const lastname = await AsyncStorage.getItem('friendLastName');
    this.setState({
      firstname,
      lastname,
    });
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
        <View style={styles.box}>
          <Text style={styles.text}>
            {' '}
            {this.state.firstname}
            {' '}
            {this.state.lastname}
          </Text>
          <Text style={styles.text}>{this.dateParser(this.state.post.timestamp)}</Text>
          <Text> </Text>
          <Text style={styles.text}>
            {' '}
            {this.state.post.text}
          </Text>
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
    backgroundColor: 'white',
    marginTop: 150,
    padding: 50,
    borderRadius: 15,
    marginRight: 5,
    marginLeft: 5,
  },
  text: {
    color: 'black',
  },
  loadingText: {
    color: 'white',
  },
});

export default ViewPost;
