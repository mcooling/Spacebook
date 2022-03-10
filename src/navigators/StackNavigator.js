import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/01_LoginSignUp/Login';
import SignUp from '../components/01_LoginSignUp/SignUp';
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

export { MainStackNavigator };
