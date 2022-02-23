import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './src/components/01_LoginSignUp/SignUp';
import Login from './src/components/01_LoginSignUp/Login';
import TabNavigator from './src/navigators/TabNavigator';

const Stack = createNativeStackNavigator();

class App extends React.Component {
  render() {
    // todo check in with ash on nav structures
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
