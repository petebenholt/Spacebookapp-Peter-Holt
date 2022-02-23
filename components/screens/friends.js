import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
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

    this.getFriends();
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  // getData = async () => {
  //   const value = await AsyncStorage.getItem('@session_token');
    
  //   return fetch("http://10.0.2.2:3333/api/1.0.0/search", {
  //         'headers': {
  //           'X-Authorization':  value
  //         }
  //       })
  //       .then((response) => {
  //           if(response.status === 200){
  //               return response.json()
  //           }else if(response.status === 401){
  //             this.props.navigation.navigate("Login");
  //           }else{
  //               throw 'Something went wrong';
  //           }
  //       })
  //       .then((responseJson) => {
  //         this.setState({
  //           isLoading: false,
  //           listData: responseJson
  //         })
  //       })
  //       .catch((error) => {
  //           console.log(error);
  //       })
  // }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };


  getFriends = async () => {
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
        <View>
          <FlatList
                data={this.state.listdata}
                renderItem={({item}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname}</Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        </View>
      );
  }


}

export default FriendsScreen;