import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsreqScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: [],

    }
  }
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

   this.getFriendsReq();
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

  getFriendsReq = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    console.log(value2)
    return fetch("http://10.0.2.2:3333/api/1.0.0/friendrequests", {
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

  addFriendreq = async (UserID) => {
    const value = await AsyncStorage.getItem('@session_token');
    //const value2 = await AsyncStorage.getItem('@user_id');
    //gotUserID = userID;
    //console.log(gotUserID);
    return fetch("http://10.0.2.2:3333/api/1.0.0/friendrequests/"+UserID, {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
          'X-Authorization':  value
          },
      })
        .then((response) => {
            if(response.status === 200){
                return response.json()
                
            }else if(response.status === 401){
              console.log("unauthorised")
            }else if(response.status === 404){
              console.log("not found")
            }else if(response.status === 500){
              console.log("server error")
            }
            else{
                throw 'server error';
            }
          this.getFriendsReq();
        })
        .catch((error) => {
            console.log(error);
        })
    
  }

  declineFriendReq = async (UserID) => {
    const value = await AsyncStorage.getItem('@session_token');
    //const value2 = await AsyncStorage.getItem('@user_id');
    //gotUserID = userID;
    //console.log(gotUserID);
    return fetch("http://10.0.2.2:3333/api/1.0.0/friendrequests/"+UserID, {
      method: 'delete',
      headers: {
          'Content-Type': 'application/json',
          'X-Authorization':  value
          },
      })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              console.log("unauthorised")
            }else if(response.status === 404){
              console.log("not found")
            }else if(response.status === 500){
              console.log("server error")
            }
            else{
                throw 'server error';
            }
            this.getFriendsReq();
        })
        .catch((error) => {
            console.log(error);
        })
    
  }


  render(){
    return(
      <View>
        <FlatList
          data={this.state.listdata}
          renderItem={({item}) => (
            
            <View>
              <Text>
                {item.first_name} {item.last_name}
                
              </Text>
              <Button
                title="Add Friend"
                color="rgb(32,32,32)"
                onPress={() => this.addFriendreq(item.user_id)}
              />
              <Button
                title="Decline Friend Request"
                color="rgb(32,32,32)"
                onPress={() => this.declineFriendReq(item.user_id)}
              />
            </View>
              )}
          keyExtractor={(item,index) => item.user_id.toString()}
        />
        
      </View>

    );
  }
}

export default FriendsreqScreen;
