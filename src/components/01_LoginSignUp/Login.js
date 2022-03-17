import React, { Component } from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import GlobalStyles from '../../utils/GlobalStyles';
import { setAuthToken, setUserId } from '../../utils/AsyncStorage';
import { login } from '../../utils/APIEndpoints';

/**
 * Handles user login screen
 */
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: 'thom@yorke.com',
      password: 'hello123',
      showAlert: false,
      alertMessage: '',
    };
  }

  /**
   * Sets user id and auth token in AsyncStorage<br>
   * @returns POST/login API call
   */
  loginUser = () => {
    this.setState({
      emailAddress: '',
      password: '',
    });
    login(this.state.emailAddress, this.state.password)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          this.setState({
            showAlert: true,
            alertMessage:
              'Please enter correct username / password and try again',
          });
        }
        if (response.status === 500) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .then((json) => {
        setUserId(json.id).then(() => {
          setAuthToken(json.token).then(() => {
            this.props.navigation.navigate('Main');
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { showAlert } = this.state;

    return (
      <View style={GlobalStyles.loginSignupContainer}>
        <View style={GlobalStyles.borderContainer}>
          <View style={GlobalStyles.headerContainer}>
            <Text style={GlobalStyles.screenTitle}>LOGIN</Text>
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
          <View style={GlobalStyles.mediumButtonContainer}>
            <TouchableOpacity
              style={GlobalStyles.mediumButton}
              onPress={() => {
                this.loginUser();
              }}
            >
              <Text style={GlobalStyles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.mediumButton}
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}
            >
              <Text style={GlobalStyles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default Login;
