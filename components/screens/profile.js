import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: [],
      newlist: [],
      info: {}
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getProfile();
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
  

  // fixItems = () => {
  //   let newdata = this.state.listdata;
  //   let firstname = this.state.listdata.first_name.toString();
  //   let lastname = this.state.listdata.last_name;
  //   let email = this.state.listdata.email;
  //   let friendcount = this.state.listdata.friendcount;
  //   this.state.newlist = newdata, firstname, lastname, email, friendcount;
  // }


  render() {
    return (
      <View>
        <Text>Name: {this.state.info.first_name} {this.state.info.last_name}</Text>
        <Text>Email-Address: {this.state.info.email}</Text>
        <Text>Friend-Count: {this.state.info.friend_count}</Text>
        <Button
          title="Edit"
          onPress={() => this.props.navigation.navigate("editProfile")}
        />
      </View>
      );
    }
}

const Styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(64,64,64)',
  },
  box: {
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
  },
  text2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    justifyContent: 'center',
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
  }

})

export default ProfileScreen;