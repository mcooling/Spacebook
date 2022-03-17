import React from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import GlobalStyles from '../../utils/GlobalStyles';
import { addNewUser } from '../../utils/APIEndpoints';

/**
 * handles user sign up
 */
class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      showAlert: false,
      alertMessage: '',
    };
  }

  /**
   * @returns POST/user API call
   * create new user account
   */
  createAccount = () => {
    if (this.state.password.length > 5) {
      addNewUser(
        this.state.firstName,
        this.state.lastName,
        this.state.emailAddress,
        this.state.password
      )
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          }
          if (response.status === 400) {
            this.setState({
              showAlert: true,
              alertMessage: 'Error type 400: Bad Request',
            });
          }
          if (response.status === 500) {
            this.setState({
              showAlert: true,
              alertMessage: 'Error type 500: Server Error',
            });
          }
        })
        .then(() => {
          this.props.navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        showAlert: true,
        alertMessage:
          'The password needs to be more than five characters. Please try again',
      });
    }
  };

  render() {
    const { showAlert } = this.state;

    return (
      <View style={GlobalStyles.loginSignupContainer}>
        <View style={GlobalStyles.borderContainer}>
          <View style={GlobalStyles.headerContainer}>
            <Text style={GlobalStyles.screenTitle}>SIGNUP</Text>
          </View>
          <TextInput
            placeholder="First Name: "
            onChangeText={(value) => this.setState({ firstName: value })}
            value={this.state.firstName}
            style={GlobalStyles.textInput}
          />
          <TextInput
            placeholder="Last Name: "
            onChangeText={(value) => this.setState({ lastName: value })}
            value={this.state.lastName}
            style={GlobalStyles.textInput}
          />
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
                this.createAccount();
              }}
            >
              <Text style={GlobalStyles.buttonText}>SIGNUP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.mediumButton}
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}
            >
              <Text style={GlobalStyles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          titleStyle={styles.titleText}
          message={this.state.alertMessage}
          messageStyle={styles.messageText}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonStyle={styles.confirmButton}
          confirmButtonTextStyle={styles.confirmButtonText}
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </View>
    );
  }
}

export default SignUp;

const styles = StyleSheet.create({
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
