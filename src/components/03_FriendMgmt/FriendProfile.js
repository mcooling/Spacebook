import React from 'react';
import {
  FlatList,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getAuthToken, getFriendId, getUserId } from '../../utils/AsyncStorage';
import PostManager from '../02_PostMgmt/PostManager';
import GlobalStyles from '../../utils/GlobalStyles';
import {
  addFriend,
  getFriendsList,
  getPostList,
  deletePost,
  getUserInfo,
  getProfilePhoto,
} from '../../utils/APIEndpoints';

/**
 * displays user profile page<br>
 * checks if user is a friend or not<br>
 * shows posts and add post button is user is a friend<br>
 * shows add friend button is user isn't a friend
 */
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
      friendAlert: false, // controls friend request alert status
      deleteAlert: false, // controls delete alert status
      alertMessage: '',
      postId: 0,
      token: null,
    };
  }

  /**
   * mount function calls on entry to get friend photo & profile data
   * also fires friend match function
   */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      const token = await getAuthToken(); // get auth token
      const userId = await getFriendId(); // get user id
      getProfilePhoto(userId, token)
        // getFriendProfilePhoto()
        .then((response) => {
          return response.blob();
        })
        .then((responseBlob) => {
          const data = URL.createObjectURL(responseBlob);
          this.setState({
            photo: data,
            isLoading: false,
            token,
          });
        })
        .catch((error) => {
          console.log(error);
        });

      getUserInfo(userId, token)
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

  // showAlert = () => {
  //   this.setState({
  //     showAlert: true,
  //   });
  // };
  //
  hideFriendAlert = () => {
    this.setState({
      friendAlert: false,
    });
  };

  hideDeleteAlert = () => {
    this.setState({
      deleteAlert: false,
    });
  };

  /**
   * checks if user is a friend<br>
   * loops through friend list<br>
   * checks for a match against profile user_id<br>
   * sets boolean, used for conditional rendering
   * @returns GET/user/user_id/friends API call
   */
  friendMatch = async () => {
    const token = await getAuthToken();
    const myId = await getUserId();

    getFriendsList(myId, token)
      // todo add error handling - speak to nath
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({
          friendList: responseJson,
        });
      })
      .then(async () => {
        const profileId = await getFriendId();
        const friendArray = this.state.friendList;
        const checkFriend = friendArray.some(function (userId) {
          return userId.user_id == profileId;
        });
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

  /**
   * gets user posts
   * @returns GET/user/{user_id}/post API call
   */
  getPosts = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    getPostList(friendId, token)
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
        // console.log(`friend post objects: ${JSON.stringify(responseJson)}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * sends friend request<br>
   * only called if user is a friend<br>
   * passes user profile id
   * @returns POST/user/{user_id}/friends API call
   */
  sendFriendRequest = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    // const friendId = this.props.route.params.profileId;
    console.log(`Friend id ${friendId}`);
    addFriend(friendId, token)
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
      });
  };

  deleteFriendPost = async () => {
    const token = await getAuthToken();
    const userId = await getFriendId();
    console.log(userId);
    console.log(this.state.postId);

    deletePost(userId, this.state.postId, token)
      .then((response) => {
        if (response.status === 200) {
          console.log(`Post ${this.state.postId} deleted`);
          this.getPosts();
        }
        if (response.status === 400 || response.status === 403) {
          this.setState({
            alertMessage:
              'You cannot delete a post that has been liked. The like has to be removed' +
              ' first',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { friendAlert } = this.state; // renders friend request alert
    const { deleteAlert } = this.state; // renders delete friend post alert

    if (!this.state.isLoading) {
      return (
        <View style={GlobalStyles.profileParentContainer}>
          <View style={GlobalStyles.profileHeaderContainer}>
            <Text style={GlobalStyles.screenTitle}>PROFILE PAGE</Text>
          </View>
          <View style={styles.pictureView}>
            <Image
              source={{ uri: this.state.photo }}
              style={{ width: 350, height: 250 }}
            />
          </View>
          <View style={GlobalStyles.profileContainer}>
            <Text style={GlobalStyles.profileTextName}>
              {`${this.state.firstName.toUpperCase()} ${this.state.lastName.toUpperCase()}`}
            </Text>
            <View style={styles.friendButtonContainer}>
              {this.state.alreadyFriend == true ? (
                <TouchableOpacity
                  style={styles.friendButton}
                  onPress={async () => {
                    const profileId = await getFriendId();
                    console.log(`profile id${profileId}`);
                    this.props.navigation.navigate('AddPost', {
                      profileId,
                    });
                  }}
                >
                  <Text style={styles.mediumButtonText}>ADD POST</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.friendButton}
                  onPress={() => {
                    this.setState({
                      friendAlert: true,
                      alertMessage: 'Your friend request has been sent',
                    });
                    this.sendFriendRequest();
                  }}
                >
                  <Text style={styles.mediumButtonText}>ADD FRIEND</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {this.state.alreadyFriend == true ? (
            <View style={{ flex: 1 }}>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <Text style={GlobalStyles.profileText}>My Posts</Text>
              </View>
              <FlatList
                data={this.state.postList}
                renderItem={({ item }) => (
                  <View style={{ paddingLeft: 20 }}>
                    <PostManager
                      friendPost={item}
                      navigation={this.props.navigation}
                      alertHandler={(f_alert, d_alert, message, post_id) =>
                        this.setState({
                          friendAlert: f_alert,
                          deleteAlert: d_alert,
                          alertMessage: message,
                          postId: post_id,
                        })
                      }
                    />
                  </View>
                )}
                keyExtractor={(item) => item.post_id.toString()}
              />
            </View>
          ) : null}
          <AwesomeAlert
            show={friendAlert}
            showProgress={false}
            title="Alert" // would have to parameterise this also
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
              this.hideFriendAlert();
            }}
          />
          <AwesomeAlert
            show={deleteAlert}
            showProgress={false}
            title="Alert" // would have to parameterise this also
            titleStyle={GlobalStyles.alertTitleText}
            message={this.state.alertMessage}
            messageStyle={GlobalStyles.alertMessageText}
            closeOnTouchOutside
            closeOnHardwareBackPress={false}
            showCancelButton
            cancelText="Cancel"
            cancelButtonStyle={GlobalStyles.alertCancelButton}
            cancelButtonTextStyle={GlobalStyles.alertCancelButtonText}
            onCancelPressed={() => {
              this.hideDeleteAlert();
            }}
            showConfirmButton
            confirmText="Delete"
            confirmButtonStyle={GlobalStyles.alertConfirmButton}
            confirmButtonTextStyle={GlobalStyles.alertConfirmButtonText}
            onConfirmPressed={() => {
              // todo not working. trying to work out how to call deletePost, in PostManager
              this.deleteFriendPost().then(() => {
                this.hideDeleteAlert();
              });
            }}
          />
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
  pictureView: {
    alignItems: 'center',
    paddingTop: 20,
  },
  friendButtonContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  friendButton: {
    backgroundColor: '#4453ce',
    width: 140,
    alignItems: 'center',
    borderRadius: 5,
  },
  mediumButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    paddingVertical: 10,
  },
});

export default FriendProfile;
