import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/components/Home";
import SignUp from "./src/components/01_LoginSignUp/SignUp";
import Login from "./src/components/01_LoginSignUp/Login";
import AddPost from "./src/components/02_PostMgmt/AddPost";
import FriendPost from "./src/components/02_PostMgmt/FriendPost";
import MyPost from "./src/components/02_PostMgmt/MyPost";
import AddFriends from "./src/components/03_FriendMgmt/AddFriends";
import FriendProfile from "./src/components/03_FriendMgmt/FriendProfile";
import MyFriends from "./src/components/03_FriendMgmt/MyFriends";
import MyDetails from "./src/components/04_ProfileMgmt/MyDetails";
import MyProfile from "./src/components/04_ProfileMgmt/MyProfile";

const Stack = createNativeStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* <Stack.Screen name="Home" component={Home} /> */}
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
          {/* <Stack.Screen name="AddPost" component={AddPost} /> */}
          {/* <Stack.Screen name="FriendPost" component={FriendPost} /> */}
          {/* <Stack.Screen name="MyPost" component={MyPost} /> */}
          {/* <Stack.Screen name="AddFriends" component={AddFriends} /> */}
          {/* <Stack.Screen name="FriendProfile" component={FriendProfile} /> */}
          {/* <Stack.Screen name="MyFriends" component={MyFriends} /> */}
          {/* <Stack.Screen name="MyDetails" component={MyDetails} /> */}
          {/* <Stack.Screen name="MyProfile" component={MyProfile} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
