import React from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, getUserId } from '../../utils/AsyncStorage';
import { getUserData } from '../../utils/UtilFunctions';

/**
 * handles profile updates<br>
 * creates a copy of name and email address values in state<br>
 * checks for any changes between each set
 */
class MyDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      o_firstName: '',
      o_lastName: '',
      o_emailAddress: '',
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

  /**
   * makes updates to username and email address
   * @returns PATCH/user{user_id} APi call
   */
  updateUserDetails = async () => {
    const token = await getAuthToken();
    const id = await getUserId();

    // stores updated items, to pass in patch request body
    const patchRequestBody = {};

    // checks state for any updated values
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
      method: 'PATCH',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchRequestBody),
    }) // todo add error handling - speak to nath
      .then(() => {
        console.log('Update successful');
        console.log(patchRequestBody);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
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
            this.updateUserDetails();
            this.props.navigation.navigate('MyProfile');
          }}
        >
          <Text style={GlobalStyles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate('MyProfile');
          }}
        >
          <Text style={GlobalStyles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyDetails;
