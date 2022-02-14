import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../../utils/GlobalStyles";

// see wk3 ex5 for text input / state
// implements POST/user endpoint
// api url http://localhost:3333/api/1.0.0/

// object to store authentication token
// todo think i might be able to replace this with import - see home/logout
const authToken = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@auth_token", jsonValue);
  } catch (error) {
    console.error(error);
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: "thom@yorke.com",
      password: "hello123",
    };
  }

  // todo check lint warnings with ash

  // function called by login button
  loginUser = () => {
    return fetch("http://localhost:3333/api/1.0.0/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // note to self: left-hand key must match the API spec
      body: JSON.stringify({
        email: this.state.emailAddress,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        console.log("Login successful");
        authToken(json).then(() => {
          this.props.navigation.navigate("Home");
        });
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
          <Text style={GlobalStyles.screenTitle}>LOGIN PAGE</Text>
        </View>
        <TextInput
          placeholder="Email Address: "
          onChangeText={(value) => this.setState({ emailAddress: value })}
          value={this.state.emailAddress}
          style={GlobalStyles.textInput}
        />
        <TextInput
          placeholder="Password: "
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password}
          style={GlobalStyles.textInput}
          secureTextEntry
        />
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.loginUser();
          }}
        >
          <Text style={GlobalStyles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("SignUp");
          }}
        >
          <Text style={GlobalStyles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Login;
