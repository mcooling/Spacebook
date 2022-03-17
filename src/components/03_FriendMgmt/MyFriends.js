import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import GlobalStyles from '../../utils/GlobalStyles';
import { getUserId, getAuthToken, setFriendId } from '../../utils/AsyncStorage';
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriendsList,
  rejectFriendRequest,
} from '../../utils/APIEndpoints';

/**
 * displays list of users friends<br>
 * displays outstanding friend requests<br>
 * handles accept / reject friend request
 */
class MyFriends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friendRequests: [],
      friends: [],
      isLoading: true,
      photo: null,
      friendAlert: false,
      alertMessage: '',
    };
  }

  componentDidMount() {
    this.getFriends();
    this.getFriendRequests();
  }

  /**
   * gets list of user's friends
   * @returns GET/user/user_id/friends API call
   */
  getFriends = async () => {
    const token = await getAuthToken();
    const userId = await getUserId();

    getFriendsList(userId, token)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 403) {
          this.setState({
            friendAlert: true,
            alertMessage:
              'Error code 403: You can only view the friends of yourself or your friends',
          });
        }
        if (response.status === 404) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friends: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * gets list of outstanding friend requests
   * @returns GET/friendrequests API call
   */
  getFriendRequests = async () => {
    const token = await getAuthToken();
    getFriendRequests(token)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 404) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friendRequests: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * accepts friend requests
   * @param id friend id
   * @returns POST/friendrequests/user_id API call
   */
  acceptFriend = async (userId) => {
    const token = await getAuthToken();
    acceptFriendRequest(userId, token)
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequests(); // clears down current list
          this.getFriends(); // update friends list with new friend
        }
        if (response.status === 401) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 404) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * rejects friend requests
   * @param id friend id
   * @returns DELETE/friendrequests/user_id API call
   */
  rejectFriend = async (userId) => {
    const token = await getAuthToken();
    rejectFriendRequest(userId, token)
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequests(); // clears down current list
        }
        if (response.status === 401) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 404) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            friendAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { friendAlert } = this.state;

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
          <Text style={GlobalStyles.screenTitle}>FRIENDS</Text>
        </View>
        <View style={GlobalStyles.friendsContainer}>
          <FlatList
            data={this.state.friends}
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
                  style={GlobalStyles.friendButton}
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
        </View>
        <View style={GlobalStyles.container}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 10 }}>
            Friend Requests
          </Text>
          <FlatList
            data={this.state.friendRequests}
            renderItem={({ item }) => (
              <View>
                <Text style={GlobalStyles.textInput}>
                  {`${item.first_name} ${item.last_name}`}
                </Text>
                <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                  <TouchableOpacity
                    style={GlobalStyles.friendRequestButton}
                    onPress={() => {
                      this.acceptFriend(item.user_id);
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>ACCEPT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={GlobalStyles.friendRequestButton}
                    onPress={() => {
                      this.rejectFriend(item.user_id);
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>REJECT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </View>
        <AwesomeAlert
          show={friendAlert}
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
            this.setState({ friendAlert: false });
          }}
        />
      </View>
    );
  }
}

export default MyFriends;
