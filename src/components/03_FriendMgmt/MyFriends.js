import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getUserId, getAuthToken, setFriendId } from '../../utils/AsyncStorage';

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

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } // todo need to add error handling conditions for other response codes
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          friends: responseJson,
        });
        console.log(responseJson);
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

    return fetch('http://localhost:3333/api/1.0.0/friendrequests/', {
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } // todo need to add error handling conditions for other response codes
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
  acceptFriendRequest = async (id) => {
    const token = await getAuthToken();

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'POST',
      headers: {
        'X-Authorization': token,
      },
    }) // todo need to add error handling conditions for other response codes
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequests(); // clears down current list
          this.getFriends(); // update friends list with new friend
        } else {
          console.log(response.status);
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
  rejectFriendRequest = async (id) => {
    const token = await getAuthToken();

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    }) // todo need to add error handling conditions for other response codes
      .then((response) => {
        if (response.status === 200) {
          this.getFriendRequests(); // clears down current list
        } else {
          console.log(response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
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
                    // console.log(item);
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
                      this.acceptFriendRequest(item.user_id);
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>ACCEPT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={GlobalStyles.friendRequestButton}
                    onPress={() => {
                      this.rejectFriendRequest(item.user_id);
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
      </View>
    );
  }
}

export default MyFriends;
