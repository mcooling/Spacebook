import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { TextInput } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { setAuthToken, setUserId } from '../../utils/AsyncStorage';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: 'marc@cooling.com',
      password: 'hello123',
    };
  }

  // todo check lint warnings with ash

  // function called by login button
  loginUser = () => {
    return (
      fetch('http://localhost:3333/api/1.0.0/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // note to self: left-hand key must match the API spec
        body: JSON.stringify({
          email: this.state.emailAddress,
          password: this.state.password,
        }),
      })
        // todo do i need to chain setters in this way? looks confusing
        .then((response) => response.json())
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
          // todo may want to display a modal / alert here?
          console.log(`Login unsuccessful: ${error}`);
        })
    );
  };

  render() {
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
      </View>
    );
  }
}

export default Login;
