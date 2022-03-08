import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/01_LoginSignUp/Login';
import SignUp from '../components/01_LoginSignUp/SignUp';
import MyFriends from '../components/03_FriendMgmt/MyFriends';
import MyProfile from '../components/04_ProfileMgmt/MyProfile';

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
    </Stack.Navigator>
  );
}

function FriendStackNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Friends" component={MyFriends} />
    </Stack.Navigator>
  );
}

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

export { MainStackNavigator, FriendStackNavigator };
