import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native-web';
import { FlatList, StyleSheet, ScrollView } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import {
  getFriendData,
  getFriendProfilePhoto,
} from '../../utils/UtilFunctions';
import { getAuthToken, getFriendId, getUserId } from '../../utils/AsyncStorage';
import PostManager from '../02_PostMgmt/PostManager';

class FriendProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      friendId: 0,
      myId: getUserId(),
      photo: null,
      isLoading: true,
      postList: [],
      friendList: [],
      alreadyFriend: false,
    };
  }

  // did mount only runs once by default...listener makes sure it gets run each time i enter screen
  // need to do this so my friends works in between tabs
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      getFriendProfilePhoto()
        .then((response) => {
          return response.blob();
        })
        .then((responseBlob) => {
          const data = URL.createObjectURL(responseBlob);
          this.setState({
            photo: data,
            isLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });

      getFriendData() // GET/user/user_id/
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          this.setState({
            firstName: responseJson.first_name,
            lastName: responseJson.last_name,
            friendId: responseJson.user_id,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      this.friendMatch();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // function to check if user is a friend
  friendMatch = async () => {
    const token = await getAuthToken();
    const myId = await getUserId();
    const profileId = await getFriendId();

    // get list of friends
    return fetch(`http://localhost:3333/api/1.0.0/user/${myId}/friends`, {
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          friendList: responseJson,
        });
      })
      .then(() => {
        console.log('Hello, you have reached friendMatch');
        console.log(`The profile id is: ${profileId}`);

        const friendArray = this.state.friendList;
        console.log(friendArray);

        const checkFriend = friendArray.some(function (userId) {
          return userId.user_id == profileId;
        });

        console.log(checkFriend);

        // const checkFriend = this.state.friendList.includes(profileId);
        console.log(`checkFriend function response: ${checkFriend}`);

        if (checkFriend) {
          console.log('Thanks for being my friend');
          this.setState({
            alreadyFriend: true,
          });
          this.getPosts();
        } else {
          console.log('Please be my friend');
          this.setState({
            alreadyFriend: false,
          });
        }
      })
      .catch((error) => {
        console.log(`Post unsuccessful: ${error}`);
      });
  };

  // GET/user/{user_id}/post
  // todo not displaying posts...think it's linked to conditional rendering
  getPosts = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    // const { friendId } = this.state;

    return fetch(`http://localhost:3333/api/1.0.0/user/${friendId}/post`, {
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
          postList: responseJson,
        });
        console.log(`friend post objects: ${JSON.stringify(responseJson)}`);
        // console.log(`Friend post text: ${responseJson.text}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // POST/user/{user_id}/friends
  // id is their id, not yours
  sendFriendRequest = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    // const friendId = this.props.route.params.profileId;
    console.log(`Friend id ${friendId}`);

    return (
      fetch(`http://localhost:3333/api/1.0.0/user/${friendId}/friends`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
        },
      })
        // .then((response) => response.json())
        // .then((responseJson) => {
        //   console.log(responseJson);
        //   console.log(
        //     `Friend request sent to ${responseJson.first_name} ${responseJson.lastName} ID: ${responseJson.user_id}`
        //   );
        // })
        .then((response) => {
          // console.log(response.status);
          if (response.status === 201) {
            console.log('Your friend request has been sent');
          } // todo need to add error handling conditions for other response codes
          if (response.status === 403) {
            console.log('User is already added by a friend');
          }
        })
        .catch((error) => {
          console.log(`Post unsuccessful: ${error}`);
        })
    );
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <View>
          <View style={GlobalStyles.headerContainer}>
            <Text style={GlobalStyles.screenTitle}>FRIEND PROFILE</Text>
          </View>
          <View style={GlobalStyles.container}>
            <Image
              source={{
                uri: this.state.photo,
              }}
              style={{
                width: 350,
                height: 300,
                borderWidth: 5,
              }}
            />
          </View>
          <Text
            style={GlobalStyles.profileTextBold}
          >{`${this.state.firstName.toUpperCase()} ${this.state.lastName.toUpperCase()}`}</Text>

          <View style={GlobalStyles.smallButtonContainer}>
            {this.state.alreadyFriend == true ? (
              <TouchableOpacity
                style={GlobalStyles.smallButton}
                onPress={async () => {
                  const profileId = await getFriendId();
                  console.log(`profile id${profileId}`);
                  this.props.navigation.navigate('AddPost', {
                    profileId,
                  });
                }}
              >
                <Text style={GlobalStyles.buttonText}>ADD POST</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={GlobalStyles.smallButton}
                onPress={() => {
                  this.sendFriendRequest();
                }}
              >
                <Text style={GlobalStyles.buttonText}>ADD FRIEND</Text>
              </TouchableOpacity>
            )}
          </View>

          {this.state.alreadyFriend == true ? (
            <View style={GlobalStyles.container}>
              <Text style={GlobalStyles.sectionHeader}>My Posts</Text>
              <View>
                <FlatList
                  data={this.state.postList}
                  renderItem={({ item }) => (
                    <View style={styles.container}>
                      <PostManager
                        friendPost={item}
                        navigation={this.props.navigation}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.post_id.toString()}
                />
              </View>
            </View>
          ) : null}
        </View>
      );
    }
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postText: {
    fontSize: 15,
    paddingTop: 10,
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    paddingTop: 10,
    paddingLeft: 20,
  },
  profileTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 16,
    paddingLeft: 20,
  },
  container: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editPostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#f59f0f',
    // paddingTop: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  deletePostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#eb083a',
    // paddingTop: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 12,
    color: 'black',
    paddingVertical: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    color: 'white',
    paddingVertical: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FriendProfile;
