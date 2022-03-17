/* eslint-disable no-unused-expressions */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listdata: [],
      searchdata: [],
      name: '',
      first_name: '',
      last_name: '',
      gotuserID: [],
      matchedusers: [],
      UserID: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
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

  getData = async () => {
    const UserID = await AsyncStorage.getItem('@user_id');
    const UserID2 = UserID;
    this.state.UserID = UserID2;
  };

  getFriendsList = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    return fetch(`http://localhost:3333/api/1.0.0/user/${value2}/friends`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  FriendsProfile = async (frienduserid) => {
    await AsyncStorage.setItem('other-user_id', frienduserid.toString());
    this.props.navigation.navigate('Friends Profile');
  };

  getUserSearch = async () => {
    const sessiontoken = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/search', {
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
          searchdata: responseJson,
          isLoading: false,
        });
        this.splitnames();
        this.addFriend();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getUserSearchQuery = async (name) => {
    const sessiontoken = await AsyncStorage.getItem('@session_token');
    if (this.state.name == '') { // clears the list if nothing in state
      this.state.matchedusers == [];
    } else {
      return fetch(`http://localhost:3333/api/1.0.0/search?q=${name}`, {
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
            matchedusers: responseJson,
            isLoading: false,
          });
          console.log('success');
          this.getUserSearch();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  splitnames = () => {
    const namedata = this.state.name;
    const searchdata2 = this.state.searchdata;
    const myArray = namedata.split(' ');          
    this.state.first_name = myArray[0];        
    this.state.last_name = myArray[1];
    for (let i = 0; i < searchdata2.length; i++) {
      if (searchdata2[i].user_givenname == this.state.first_name) {
        this.state.gotuserID = searchdata2[i].user_id;
        this.state.matchedusers = searchdata2[i].user_id; //purpose of this is to split the name in two states so it can get the id from the name

      }
    }
  };

  addFriend = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const gotUserID = this.state.gotuserID;
    return fetch(`http://localhost:3333/api/1.0.0/user/${gotUserID}/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 403) {
          throw 'User is already added as a friend';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addMatchedFriend = async (userid) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${userid}/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          this.props.navigation.navigate('Login');
        } else if (response.status === 403) {
          throw 'User is already added as a friend';
        } else if (response.status === 404) {
         throw 'Not Found';
        } else {
          throw 'Server error';
        }
      })
      .catch((error) => {
        console.log(error);
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
        <View>
          <TextInput
            placeholder="Add Friend Name..."
            placeholderTextColor="white"
            style={styles.textInput}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
          />
          <FlatList
            data={this.state.matchedusers}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <Text style={styles.friendboxtext}>
                  {item.user_givenname}
                  {' '}
                  {item.user_familyname}
                </Text>
                <Button
                  title="Add"
                  color="purple"
                  onPress={() => this.addMatchedFriend(item.user_id.toString())}
                />
              </View>
            )}
          />
          <View style={styles.friendButtons}>
            <Button
              title="    Add Friend    "
              color="purple"
              onPress={() => this.getUserSearch()}
            />
            <Button
              title=" Search Friend "
              color="purple"
              onPress={() => this.getUserSearchQuery(this.state.name)}
            />
            <Button
              title="Friend Requests"
              color="purple"
              onPress={() => this.props.navigation.navigate('Friend Requests')}
            />
          </View>

        </View>
        <View style={styles.friendListTextBox}>
          <Text style={styles.friendlistText}>Friends List</Text>
        </View>
        <FlatList
          data={this.state.listdata}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text style={styles.friendboxtext}>
                {item.user_givenname}
                {' '}
                {item.user_familyname}
              </Text>
              <View style={styles.viewProfileButtons}>
                <Button
                  title="View Profile"
                  color="purple"
                  onPress={() => this.FriendsProfile(item.user_id)}
                />
              </View>

            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
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
  box: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 8,
    borderRadius: 15,
    marginRight: 5,
    marginLeft: 5,
  },
  textInput: {
    padding: 5,
    borderWidth: 1,
    margin: 5,
    borderRadius: 8,
    borderColor: 'white',
    color: 'white',
    placeholderTextColor: 'white',
    numberOfLines: '2',
  },
  friendboxtext: {
    color: 'black',
    // fontWeight: 'bold',
    fontSize: 15,
  },
  friendlistText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    justifyContent: 'center',
  },
  friendListTextBox: {
    marginLeft: 130,
  },
  friendButtons: {
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  viewProfileButtons: {
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loadingText: {
    color: 'white',
  },

});

export default FriendsScreen;
