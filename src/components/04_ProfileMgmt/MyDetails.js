import React from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, getUserId } from '../../utils/AsyncStorage';
import { getUserInfo, updateUserInfo } from '../../utils/APIEndpoints';

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
      userId: 0,
      token: null,
      showAlert: false,
      alertMessage: '',
    };
  }

  async componentDidMount() {
    const token = await getAuthToken(); // get auth token
    const userId = await getUserId(); // get user id
    getUserInfo(userId, token)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          emailAddress: responseJson.email,
          o_firstName: responseJson.first_name,
          o_lastName: responseJson.last_name,
          o_emailAddress: responseJson.email,
          userId,
          token,
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

    updateUserInfo(this.state.userId, this.state.token, patchRequestBody)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 400: Bad Request',
          });
        }
        if (response.status === 401) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 403) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 404: Forbidden',
          });
        }
        if (response.status === 404) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { showAlert } = this.state;

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
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          titleStyle={GlobalStyles.alertTitleText}
          message={this.state.alertMessage}
          messageStyle={GlobalStyles.alertMessageText}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonStyle={GlobalStyles.alertConfirmButton}
          confirmButtonTextStyle={GlobalStyles.alertConfirmButtonText}
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </View>
    );
  }
}

export default MyDetails;
