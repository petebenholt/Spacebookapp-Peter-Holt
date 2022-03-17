/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsreqScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listdata: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getFriendsReq();
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

  getFriendsReq = async () => {
    const sessiontoken = await AsyncStorage.getItem('@session_token'); // Gets friend requests
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessiontoken,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          listdata: responseJson,
          isLoading: false,
        });
        console.log(this.state.listdata);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addFriendreq = async (UserID) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${UserID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return console.log('OK');
        } if (response.status === 401) {
          console.log('unauthorised');
        } else if (response.status === 404) {
          console.log('not found');
        } else if (response.status === 500) {
          console.log('server error');
        } else {
          throw 'server error';
        }
      })
      .then(() => {
        this.getFriendsReq();
        console.log('success');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  declineFriendReq = async (UserID) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${UserID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return console.log('OK');
        } if (response.status === 401) {
          console.log('unauthorised');
        } else if (response.status === 404) {
          console.log('not found');
        } else if (response.status === 500) {
          console.log('server error');
        } else {
          throw 'server error';
        }
      })
      .then(() => {
        this.getFriendsReq();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) { // Loading Screen
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
          <Text>Loading..</Text>
        </View>
      );
    } if (this.state.listdata.length === 0) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: 'rgb(32,32,32)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >

          <Text style={{ color: 'white', fontSize: 20, marginBottom: 100 }}>
            No Friend Requests!
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.listdata}
          extraData={this.state}
          keyExtractor={(item, index) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text />
              <Text style={styles.nameText}>
                {' '}
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <View style={styles.buttons}>
                <Button
                  title="  Add Friend  "
                  color="purple"
                  onPress={() => this.addFriendreq(item.user_id)}
                />
                <Button
                  title="Decline Request"
                  color="red"
                  onPress={() => this.declineFriendReq(item.user_id)}
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
    justifyContent: 'center',

  },
  nameText: {
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,

  },
  buttons: {
    justifyContent: 'flex-end',
    marginRight: 100,
    marginLeft: 100,
    marginBottom: 10,

  },
  box: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
  },

});
export default FriendsreqScreen;
