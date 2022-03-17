import React from 'react';
import {
  FlatList,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AwesomeAlert from 'react-native-awesome-alerts';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, setFriendId } from '../../utils/AsyncStorage';
import { searchAllUsers } from '../../utils/APIEndpoints';

/**
 * handles user search functionality<br>
 * includes q, search_in, limit & offset query params
 */
class SearchUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      offset: 0,
      users: [],
      isVisible: false,
      isChecked: false,
      search_in: 'all',
      showAlert: false,
      alertMessage: '',
    };
  }

  componentDidMount() {
    this.searchUsers();
  }

  /**
   * searches users<br>
   * incorporates q, search_in, limit & offset queries
   * @param currentOffsetValue
   * @returns GET/search API call
   */
  searchUsers = async (currentOffsetValue) => {
    const token = await getAuthToken();

    // resets offset value in search string
    if (currentOffsetValue > 0) {
      this.setState({ offset: 0 });
    }

    // changes search_in value in search string, when 'search in friends' checkbox clicked
    if (this.state.isChecked) {
      this.setState({
        search_in: 'friends',
      });
    }

    searchAllUsers(
      this.state.searchValue,
      this.state.offset,
      this.state.search_in,
      token
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 401: Bad Request',
          });
        }
        if (response.status === 401) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 500) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .then((responseJson) => {
        this.setState({
          users: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { showAlert } = this.state;

    if (this.state.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>SEARCH USERS</Text>
        </View>
        <View>
          <View style={GlobalStyles.mediumButtonContainer}>
            <TextInput
              placeholder="User name: "
              onChangeText={(value) => this.setState({ searchValue: value })}
              value={this.state.searchValue}
              style={GlobalStyles.searchUserTextInput}
            />
          </View>
          <View>
            <CheckBox
              style={{
                flex: 1,
                paddingLeft: 20,
                alignItems: 'flex-start',
              }}
              onClick={() => {
                this.setState({
                  isChecked: !this.state.isChecked,
                  isVisible: true,
                  search_in: 'all',
                });
                this.searchUsers(this.state.offset);
              }}
              isChecked={this.state.isChecked}
              leftText="Search Only Friends"
              leftTextStyle={{ fontSize: 18, paddingRight: 16 }}
              checkedImage={
                <MaterialCommunityIcons
                  name="checkbox-marked"
                  color="green"
                  size={32}
                />
              }
              unCheckedImage={
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  color="red"
                  size={32}
                />
              }
            />
          </View>
          <View style={GlobalStyles.mediumButtonContainer}>
            <TouchableOpacity
              style={GlobalStyles.searchButtons}
              onPress={() => {
                this.searchUsers(this.state.offset);
                this.setState({
                  isVisible: true,
                  search_in: 'all',
                });
              }}
            >
              <Text style={GlobalStyles.buttonText}>SEARCH</Text>
            </TouchableOpacity>
            {this.state.users.length === 5 ? (
              <TouchableOpacity
                style={GlobalStyles.searchButtons}
                onPress={() => {
                  this.state.offset += 5;
                  this.searchUsers();
                  this.setState({
                    isVisible: true,
                  });
                }}
              >
                <Text style={GlobalStyles.buttonText}>NEXT</Text>
              </TouchableOpacity>
            ) : null}
            {this.state.offset > 0 ? (
              <TouchableOpacity
                style={GlobalStyles.searchButtons}
                onPress={() => {
                  this.state.offset -= 5;
                  this.searchUsers();
                  this.setState({
                    isVisible: true,
                  });
                }}
              >
                <Text style={GlobalStyles.buttonText}>BACK</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <FlatList
          data={this.state.users}
          renderItem={({ item }) => (
            <View style={GlobalStyles.searchFriendContainer}>
              <Text
                style={GlobalStyles.textInput}
                onPress={() => {
                  setFriendId(item.user_id);
                  this.props.navigation.navigate('FriendProfile');
                }}
              >
                {`${item.user_givenname} ${item.user_familyname}`}
              </Text>
              <TouchableOpacity
                style={GlobalStyles.button}
                onPress={() => {
                  setFriendId(item.user_id);
                  this.props.navigation.navigate('FriendProfile');
                }}
              >
                <Text style={GlobalStyles.buttonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
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

export default SearchUsers;
