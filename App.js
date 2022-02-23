import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './components/screens/home';
import LoginScreen from './components/screens/login';
import SignupScreen from './components/screens/signup';
import LogoutScreen from './components/screens/logout';
import FriendsScreen from './components/screens/friends';

const Stack =createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName= 'Logout'>
        <Stack.Screen name ="Login" component={LoginScreen} />
        <Stack.Screen name ="Home" component={HomeScreen} />
        <Stack.Screen name ="Signup" component={SignupScreen} />
        <Stack.Screen name ="Logout" component={LogoutScreen} />
        <Stack.Screen name ="Friends" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );



}

export default App;