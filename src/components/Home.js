import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { TextInput } from "react-native";
import GlobalStyles from "../utils/GlobalStyles";

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

  // function called by login button
  loginUser = () => {
    // create an object to store request body
    // passed in with fetch
    // values correspond to the values keyed in the view textinput form
    // at this point, these are currently the 'temp' values held in state

    const requestBody = {
      emailAddress: this.state.emailAddress,
      password: this.state.password,
    };

    // now have the request body object, we can do the fetch
    // including header and body, as well as method
    // have to use stringify, to convert js object to json string
    return fetch("http://localhost:3333/api/1.0.0/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then(() => {
        // todo navigate to post page
        console.log("Login successful");
      })
      .catch((error) => {
        // todo may want to display a modal / alert here?
        console.log(`Login unsuccessful: ${error}`);
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
      </View>
    );
  }
}

export default Home;
