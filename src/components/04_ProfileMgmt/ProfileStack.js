import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddPost from '../02_PostMgmt/AddPost';
import MyPost from '../02_PostMgmt/MyPost';
import MyFriends from '../03_FriendMgmt/MyFriends';
import FriendProfile from '../03_FriendMgmt/FriendProfile';
import MyDetails from './MyDetails';
import UpdatePhoto from './UpdatePhoto';

import MyProfile from './MyProfile';
import Login from '../01_LoginSignUp/Login';

const Stack = createNativeStackNavigator();

class ProfileStack extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="MyDetails" component={MyDetails} />
        <Stack.Screen name="UpdatePhoto" component={UpdatePhoto} />
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="MyFriends" component={MyFriends} />
        <Stack.Screen name="FriendProfile" component={FriendProfile} />

        <Stack.Screen name="AddPost" component={AddPost} />
        <Stack.Screen name="MyPost" component={MyPost} />
      </Stack.Navigator>
    );
  }
}

export default ProfileStack;
