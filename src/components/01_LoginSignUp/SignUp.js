import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { StyleSheet, TextInput } from "react-native";

// see wk3 ex5 for text input / state
// implements POST/user endpoint
// api url http://localhost:3333/api/1.0.0/

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
    };
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="First Name: "
          onChangeText={(value) => this.setState({ firstName: value })}
          value={this.state.firstName}
        />
        <TextInput
          placeholder="Last Name: "
          onChangeText={(value) => this.setState({ lastName: value })}
          value={this.state.lastName}
        />
        <TextInput
          placeholder="Email Address: "
          onChangeText={(value) => this.setState({ emailAddress: value })}
          value={this.state.emailAddress}
        />
        <TextInput
          placeholder="Password: "
          onChangeText={(value) => this.setState({ password: value })}
          value={this.state.password} // todo add password hashing
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // todo implement POST/user endpoint (see Wk3/Ex12)
            console.log(this.state.firstName);
          }}
        >
          <Text style={styles.buttonText}>SIGNUP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#6369b8",
    padding: 10,
    marginTop: 10,
    width: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  inputText: {
    fontSize: 20,
    paddingBottom: 10,
    justifyContent: "flex-start",
    marginLeft: 14,
  },
});
