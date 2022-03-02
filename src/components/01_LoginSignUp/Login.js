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

  // function to be called from default class (no args)

  /**
   * Function to log in user
   * @returns POST/login API response
   * Sets user id and auth token in AsyncStorage
   */
  loginUser = () => {
    return fetch('http://localhost:3333/api/1.0.0/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.emailAddress,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('Login successful');
        console.log(json);
        setUserId(json.id).then(() => {
          setAuthToken(json.token).then(() => {
            // eslint-disable-next-line react/prop-types
            this.props.navigation.navigate('Main');
          });
        });
      })
      .catch((error) => {
        this.showAlert();
        console.log(`Login unsuccessful: ${error}`);
      });
  };

  render() {
    const { showAlert } = this.state;

    return (
      <View>
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
        <View style={GlobalStyles.smallButtonContainer}>
          <TouchableOpacity
            style={GlobalStyles.smallButton}
            onPress={() => {
              this.loginUser();
            }}
          >
            <Text style={GlobalStyles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.smallButton}
            onPress={() => {
              this.props.navigation.navigate('SignUp');
            }}
          >
            <Text style={GlobalStyles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Login Failed"
          titleStyle={styles.titleText}
          message="Please enter correct username / password and try again"
          messageStyle={styles.messageText}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonStyle={styles.confirmButton}
          confirmButtonTextStyle={styles.confirmButtonText}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    color: '#23341c',
    fontSize: 18,
    textAlign: 'center',
  },
  titleText: {
    color: '#23341c',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButton: {
    width: 100,
    textAlign: 'center',
    backgroundColor: '#45732b',
  },
  confirmButtonText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
