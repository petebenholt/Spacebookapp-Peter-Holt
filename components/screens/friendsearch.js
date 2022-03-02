import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsSearchScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: [],
      searchdata: [],
      name: "",
      first_name: "",
      last_name: "",
      gotuserID: ""
      
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserSearch();
    
  };

  componentWillUnmount() {
    this.unsubscribe();
  };

  getUserSearch = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    console.log(value2)
    return fetch("http://10.0.2.2:3333/api/1.0.0/search", {
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
            searchdata: responseJson
          })
          //console.log(this.state.searchdata)
        })
        .catch((error) => {
            console.log(error);
        })
    
  }














  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };


  render() {
    return (
      <View>

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

export default FriendsSearchScreen;




