import React from "react";
import { Text, TouchableOpacity, View } from "react-native-web";
import { FlatList, TextInput } from "react-native";
import GlobalStyles from "../../utils/GlobalStyles";
import { getUserId, getAuthToken } from "../../utils/AsyncStorage";

class MyFriends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friendRequests: [],
      friends: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getFriends();
    this.getFriendRequests();
    // todo need to add isLoading - see shopping list
  }

  // todo GET/user/user_id/friends
  // stumped - view showing 'undefined objects instead of the name (like friend requests)
  getFriends = async () => {
    const token = await getAuthToken();
    const userId = await getUserId();

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } // todo need to add error handling conditions for other response codes
      })
      .then((responseJson) => {
        console.log("GET friends response");
        console.log(responseJson);
        this.setState({
          isLoading: false,
          friends: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // GET/friendrequests
  getFriendRequests = async () => {
    const token = await getAuthToken();

    return fetch("http://localhost:3333/api/1.0.0/friendrequests/", {
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } // todo need to add error handling conditions for other response codes
      })
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          friendRequests: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // POST/friendrequests/user_id
  acceptFriendRequest = async (id) => {
    const token = await getAuthToken();

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: "POST",
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Friend request accepted");
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

  // DELETE/friendrequests/user_id
  rejectFriendRequest = async (id) => {
    const token = await getAuthToken();

    return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: "DELETE",
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Friend request rejected");
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
        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>FRIENDS</Text>
        </View>

        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>My Friends</Text>
          <FlatList
            data={this.state.friends}
            renderItem={({ item }) => (
              <View>
                <Text style={GlobalStyles.textInput}>
                  {`${item.first_name} ${item.last_name}`}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </View>

        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>Friend Requests</Text>
          <FlatList
            data={this.state.friendRequests}
            renderItem={({ item }) => (
              <View>
                <Text style={GlobalStyles.textInput}>
                  {`${item.first_name} ${item.last_name}`}
                </Text>
                <TouchableOpacity
                  style={GlobalStyles.button}
                  onPress={() => {
                    this.acceptFriendRequest(item.user_id);
                  }}
                >
                  <Text style={GlobalStyles.buttonText}>ACCEPT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={GlobalStyles.button}
                  onPress={() => {
                    this.rejectFriendRequest(item.user_id);
                  }}
                >
                  <Text style={GlobalStyles.buttonText}>REJECT</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.user_id.toString()}
          />
        </View>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("AddFriends");
          }}
        >
          <Text style={GlobalStyles.buttonText}>ADD FRIEND</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={GlobalStyles.button}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Text style={GlobalStyles.buttonText}>HOME</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyFriends;
