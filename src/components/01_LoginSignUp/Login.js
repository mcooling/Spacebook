import React, { Component } from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
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
    };
  }

  /**
   * show/hide alert functions<br>
   * used by AwesomeAlert library
   */
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

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
      // return fetch('http://localhost:3333/api/1.0.0/login/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: this.state.emailAddress,
      //     password: this.state.password,
      //   }),
      // })
      // todo add error handling - speak to nath
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          this.showAlert(); // parameterise with error message
        }
        if (response.status === 500) {
        }
      })
      .then((json) => {
        console.log('Login successful');
        console.log(json);
        setUserId(json.id).then(() => {
          setAuthToken(json.token).then(() => {
            this.props.navigation.navigate('Main');
          });
        });
      })
      .catch((error) => {
        this.showAlert();
        console.log(
          `Login unsuccessful: please enter correct username & password`
        );
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
          title="Login Failed"
          titleStyle={GlobalStyles.alertTitleText}
          message="Please enter correct username / password and try again"
          messageStyle={GlobalStyles.alertMessageText}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonStyle={GlobalStyles.alertConfirmButton}
          confirmButtonTextStyle={GlobalStyles.alertConfirmButtonText}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

export default Login;
