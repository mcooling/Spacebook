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
import { errorCodes } from '../../utils/ErrorCodes';

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

  /**
   * @returns POST/user API call
   */
  createAccount = () => {
    if (this.state.password.length > 5) {
      return fetch('http://localhost:3333/api/1.0.0/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          email: this.state.emailAddress,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          console.log('Signup successful');
          this.props.navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(`Signup unsuccessful: ${error}`);
        });
    }
    console.log('Password needs to be more than 5 characters');
    this.showAlert();
  };

  render() {
    const { showAlert } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.borderContainer}>
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
          <View style={GlobalStyles.smallButtonContainer}>
            <TouchableOpacity
              style={GlobalStyles.smallButton}
              onPress={() => {
                this.createAccount();
              }}
            >
              <Text style={GlobalStyles.buttonText}>SIGNUP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.smallButton}
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
          title="Signup Failed"
          titleStyle={styles.titleText}
          message="The password needs to be more than five characters. Please try again."
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

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderContainer: {
    height: '100vh',
    width: '100vw',
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
