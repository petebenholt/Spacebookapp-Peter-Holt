import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getFriendsList();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };


  getFriendsList = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    console.log(value2)
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
            listdata: responseJson
          })
        })
        .catch((error) => {
            console.log(error);
        })
  }

  render() {
      return (
          <View style= {Styles.container}>
            <View style = {Styles.button}>
              <Button
                title="     Add Friend     "
                color="rgb(32,32,32)"
              />
              <Button 
                title="Friend Requests"
                color="rgb(32,32,32)"
                onPress={() => this.props.navigation.navigate("Friend Requests")}
              />
            </View>
              <FlatList
                data={this.state.listdata}
                renderItem={({item}) => (
                  <View style= {Styles.box}>
                    <Text style = {Styles.text}>
                      {item.user_givenname} {item.user_familyname}
                    </Text>
                  </View>
                    )}
                keyExtractor={(item,index) => item.user_id.toString()}
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
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  }

})

export default FriendsScreen;