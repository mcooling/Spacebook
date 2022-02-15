import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { TextInput } from "react-native";
import GlobalStyles from "../../utils/GlobalStyles";
import { getAuthToken, getUserId } from "../../utils/AsyncStorage";

class MyProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
    };
  }

  // function to get user data
  getUserData = async () => {
    const token = await getAuthToken(); // get auth token
    const id = await getUserId(); // get user id
    // make api get request, passing id
    console.log(token);
    console.log(id);
    return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          emailAddress: responseJson.email,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // todo check with ash. still not quite sure what this is doing
    // why needed here but not on others?
  componentDidMount() {
    this.getUserData();
  }

  render() {
    return (
      <View>
        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>MY PROFILE</Text>
        </View>
        <Text
          style={GlobalStyles.textInput}
        >{`${this.state.firstName} ${this.state.lastName}`}</Text>
        <Text
          style={GlobalStyles.textInput}
        >{`${this.state.emailAddress}`}</Text>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("MyDetails");
          }}
        >
          <Text style={GlobalStyles.buttonText}>EDIT DETAILS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={GlobalStyles.buttonText}>UPDATE PHOTO</Text>
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

export default MyProfile;
