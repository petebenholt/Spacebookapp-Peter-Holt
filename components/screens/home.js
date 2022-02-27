import React, {Component} from 'react';
import {View, Text, FlatList, Button, StyleSheet, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      postData: [],
      postText: '',
      postDataText: []
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
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

  postAPost = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const value2 = await AsyncStorage.getItem('@user_id');
    let text = this.state.postText;
    //this.addtexttoarray();
    //postTextarray.push(postText)
    console.log(this.state.postText);
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+value2+"/post", {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
          'X-Authorization':  value
          },
      body: JSON.stringify(text)
      })
        .then((response) => {
            if(response.status === 201){
                console.log("created");
                return response.json()
            }else if(response.status === 401){
              console.log("unauth");
            }else if(response.status === 404){
              console.log("not found");
            }else if(response.status === 500){
              console.log("server error");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
          this.setState({
            postData: responseJson
          })
        console.log(this.state.postData)
        })
        .catch((error) => {
            console.log(error);
        })
  }

  // addtexttoarray = () => {
  //   let text = this.state.postText;
  //   let arr = this.state.postDataText;
  //   arr.push(text);
  //   console.log(arr);
  //   let objectarr = Object.assign({}, arr);
  //   arr.reduce((text) => ({ ...a, [v]: v}), {})
  //   console.log(objectarr);
  //   objectarr = this.state.postDataText;

  // }


  render() {
      return (
        <View style= {styles.container}>
          <Button
          title = 'Profile'
          onPress={() => this.props.navigation.navigate("Profile")}

          />
          <Button
          title = 'Friends'
          onPress={() => this.props.navigation.navigate("Friends")}

          />
          <TextInput
            placeholder="Enter Your Post..."
            placeholderTextColor= 'white'
            color= 'white'
            multiline = {true}
            onChangeText={(postText) => this.setState({postText})}
            value={this.state.postText}
            style={{padding:5, borderWidth:1, margin:5}}
            borderColor= "white"
          />
          <Button
          title = 'Add Post'
          onPress={() => this.postAPost()}
          />
          <FlatList
                data={this.state.postData}
                renderItem={({item}) => (
                  <View>
                    <Text>
                      {item.text}
                    </Text>
                  </View>
                    )}
                //keyExtractor={(item,index) => item.user_id.toString()}
              />
      
        </View>
      );
    }
    
  
}

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: 'rgb(32,32,32)',
    },


  })

export default HomeScreen;