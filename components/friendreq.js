import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsreqScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      listdata: []

    }
  }

  render(){
    return(
      <View>
        <Text>Hello</Text>
      
      
      </View>

    );
  }
}

export default FriendsreqScreen;
