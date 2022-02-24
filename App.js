import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './components/screens/home';
import LoginScreen from './components/screens/login';
import SignupScreen from './components/screens/signup';
import LogoutScreen from './components/screens/logout';
import FriendsScreen from './components/screens/friends';
import FriendsreqScreen from './components/screens/friendreq';


const Stack =createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName= 'Logout'>
        <Stack.Screen 
        name ="Login" 
        component={LoginScreen} 
        options={{ 
        headerStyle: 
        {backgroundColor: 'black' 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        }}
        />
        <Stack.Screen 
        name ="Home" 
        component={HomeScreen}
        options={{ 
          headerStyle: 
          {backgroundColor: 'black' 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          }}
        />
        <Stack.Screen
        name ="Signup" 
        component={SignupScreen}
        options={{ 
          headerStyle: 
          {backgroundColor: 'black' 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          }}
        />
        <Stack.Screen 
        name ="Logout" 
        component={LogoutScreen} 
        options={{ 
          headerStyle: 
          {backgroundColor: 'black' 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          }}
        />
        <Stack.Screen 
        name ="Friends" 
        component={FriendsScreen}
        options={{ 
          headerStyle: 
          {backgroundColor: 'black' 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          }} 
        />
        <Stack.Screen 
        name ="Friend Requests" 
        component={FriendsreqScreen}
        options={{ 
          headerStyle: 
          {backgroundColor: 'black' 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );



}

export default App;