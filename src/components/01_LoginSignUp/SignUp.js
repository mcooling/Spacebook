import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { TextInput } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';

// see wk3 ex5 for text input / state
// implements POST/user endpoint
// api url http://localhost:3333/api/1.0.0/

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
    };
  }

  // function called by sign up button
  // implements POST/user API call
  createAccount = () => {
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
        // todo may want to display a modal / alert here?
        console.log(`Signup unsuccessful: ${error}`);
      });
  };

  render() {
    return (
      <View>
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
    );
  }
}

export default SignUp;
