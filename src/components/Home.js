import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { TextInput } from "react-native";
import GlobalStyles from "../utils/GlobalStyles";
import { getAuthToken, deleteAuthToken } from "../utils/AsyncStorage";

// see wk3 ex5 for text input / state
// implements POST/user endpoint
// api url http://localhost:3333/api/1.0.0/

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: "",
      password: "",
    };
  }

  // todo go through lint warnings with Ash

  // function called by logout button
  logoutUser = async () => {
    const { token } = await getAuthToken();
    console.log(token);
    return fetch("http://localhost:3333/api/1.0.0/logout/", {
      method: "POST",
      headers: {
        "X-Authorization": token,
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          console.log("Logout successful");
          await deleteAuthToken();
          this.props.navigation.navigate("Login");
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        // todo may want to display a modal / alert here?
        console.log(`Logout unsuccessful: ${error}`);
      });
  };

  render() {
    return (
      <View>
        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>HOME PAGE</Text>
        </View>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("AddPost");
          }}
        >
          <Text style={GlobalStyles.buttonText}>ADD POST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("MyPost");
          }}
        >
          <Text style={GlobalStyles.buttonText}>MY POST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("FriendPost");
          }}
        >
          <Text style={GlobalStyles.buttonText}>FRIENDS POST</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("MyFriends");
          }}
        >
          <Text style={GlobalStyles.buttonText}>MY FRIENDS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("MyProfile");
          }}
        >
          <Text style={GlobalStyles.buttonText}>MY PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.logoutUser();
          }}
        >
          <Text style={GlobalStyles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Home;
