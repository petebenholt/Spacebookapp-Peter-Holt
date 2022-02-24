import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



class FriendsScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: [],
      searchdata: [],
      name: "",
      first_name: "",
      last_name: ""
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
      })
      .catch((error) => {
          console.log(error);
      })
}

compareNames = () => {




}


  render() {
      return (
          <View style= {Styles.container}>
            <View style = {Styles.button}>
              <TextInput
                placeholder="Enter Friend Name..."
                placeholderTextColor= 'white'
                color= 'white'
                style={{padding:5, borderWidth:1, margin:5}}
                borderColor= "black"
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
              />
              <Button
                title="Add Friend"
                color="rgb(32,32,32)"
                
              />
              <Button 
                title="Friend Requests"
                color="darkred"
                onPress={() => this.props.navigation.navigate("Friend Requests")}
              />
              
            </View>
              <View style = {Styles.textbox}>
              <Text style= {Styles.text2}>Friends List</Text>
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

export default FriendsScreen;