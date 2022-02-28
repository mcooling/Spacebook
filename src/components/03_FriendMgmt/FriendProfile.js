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
          // console.log(`My friend id is: ${this.state.friendId}`);
        })
        .catch((error) => {
          console.log(error);
        });
      this.getPosts();
      this.friendMatch();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // fetches all posts for the friend id
  // GET/user/{user_id}/post
  // todo why isn't this working when accessing friendId from state?
  // setting state in getFriendData, but looks like this is being called first
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
        // console.log("GET/user/user_id/post response");
        // console.log(responseJson);
        // console.log(responseJson.friendId);
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
  // todo error on friend profile
  // assuming because they're not a friend yet, so no posts visible?
  // do i need a check then, to only fetch posts if they're a friend?
  // another use case for checking if user id already a friend?

  sendFriendRequest = async () => {
    const token = await getAuthToken();
    const friendId = getFriendId();
    // const friendId = this.props.route.params.profileId;
    console.log(`Friend id ${friendId}`);

    return fetch(`http://localhost:3333/api/1.0.0/user/${friendId}/friends`, {
      method: 'POST',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        // console.log(`Friend request sent to ${responseJson.first_name}
        // ${responseJson.lastName} ID: ${responseJson.user_id}`);
      })
      .catch((error) => {
        console.log(`Post unsuccessful: ${error}`);
      });
  };

  // function to check if friend profile id is one of my friends
  // todo can't get the friend check to work - won't return true boolean
  friendMatch = async () => {
    // get list of friends and update friendList array
    // loop through friend list
    // if there's a match, set this.state.friendMatch value to true
    // add friend button only rendered where friendmatch == false
    // https://careerkarma.com/blog/javascript-array-contains/

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

        // todo isn't returning expected result - true
        // returning false, expecting it to return true
        const checkFriend = this.state.friendList.some(
          (friend) => friend.user_id === profileId
        );
        console.log(`checkFriend function response: ${checkFriend}`);

        if (!checkFriend) {
          console.log('Please be my friend');
        } else {
          console.log('Thanks for being my friend');
          this.setState({
            alreadyFriend: true,
          });
        }
      })
      .catch((error) => {
        console.log(`Post unsuccessful: ${error}`);
      });
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

            {/* todo linked to friendMatch bug - not rendering as friend state not matching properly

            https://stackoverflow.com/questions/8217419/how-to-determine-if-
            javascript-array-contains-an-object-with-an-attribute-that-e */}

            {this.state.alreadyFriend == false ? (
              <TouchableOpacity
                style={GlobalStyles.smallButton}
                onPress={() => {
                  this.sendFriendRequest().then(() => {});
                }}
              >
                <Text style={GlobalStyles.buttonText}>ADD FRIEND</Text>
              </TouchableOpacity>
            ) : null}
          </View>

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

            <Text>Add, update, delete post functionality</Text>
            <Text>Like / remove like functionality</Text>
            <Text>
              {'\n'}'Send Friend Request' only when user not a friend?
            </Text>
          </View>
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
