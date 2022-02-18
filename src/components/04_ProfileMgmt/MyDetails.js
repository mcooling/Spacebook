import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { TextInput } from "react-native";
import GlobalStyles from "../../utils/GlobalStyles";
import { getAuthToken, getUserId } from "../../utils/AsyncStorage";
import { getUserData } from "../../utils/ReusableFunctions";

class MyDetails extends React.Component {
  constructor(props) {
    super(props);

    // todo check with ash. o_ used to compare 'original' vals with updated ones
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      o_firstName: "",
      o_lastName: "",
      o_emailAddress: "",
    };
  }

  componentDidMount() {
    getUserData()
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          emailAddress: responseJson.email,
          o_firstName: responseJson.first_name,
          o_lastName: responseJson.last_name,
          o_emailAddress: responseJson.email,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // called by update button onclick
  updateUserDetails = async () => {
    const token = await getAuthToken();
    const id = await getUserId();

    // stores updated items, to pass in patch request body
    const patchRequestBody = {};

    // checks state for any update values
    if (this.state.firstName !== this.state.o_firstName) {
      patchRequestBody.first_name = this.state.firstName;
    }
    if (this.state.lastName !== this.state.o_lastName) {
      patchRequestBody.last_name = this.state.lastName;
    }
    if (this.state.emailAddress !== this.state.o_emailAddress) {
      patchRequestBody.email = this.state.emailAddress;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: "PATCH",
      headers: {
        "X-Authorization": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patchRequestBody),
    })
      .then(() => {
        console.log("Update successful");
        console.log(
          "UPDATE HARDCODED EMAIL IN LOGIN.JS, IF YOU JUST CHANGED EMAIL ADDRESS!"
        );
        console.log(patchRequestBody);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // todo go through lint warnings with Ash

  render() {
    return (
      <View>
        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>MY DETAILS</Text>
        </View>

        <TextInput
          value={this.state.firstName}
          onChangeText={(firstName) => this.setState({ firstName })}
          style={GlobalStyles.textInput}
        />
        <TextInput
          value={this.state.lastName}
          onChangeText={(value) => this.setState({ lastName: value })}
          style={GlobalStyles.textInput}
        />
        <TextInput
          value={this.state.emailAddress}
          onChangeText={(value) => this.setState({ emailAddress: value })}
          style={GlobalStyles.textInput}
        />

        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.updateUserDetails().then(() => {});
            // this.props.navigation.navigate("Home");
          }}
        >
          <Text style={GlobalStyles.buttonText}>SUBMIT CHANGES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={GlobalStyles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyDetails;