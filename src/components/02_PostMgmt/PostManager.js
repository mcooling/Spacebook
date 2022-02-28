import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { StyleSheet } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  getAuthToken,
  getFriendId,
  getPostId,
  getUserId,
} from '../../utils/AsyncStorage';

class PostManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorId: this.props.friendPost.author.user_id,
      authorFirstName: this.props.friendPost.author.first_name,
      authorLastName: this.props.friendPost.author.last_name,
      postContent: this.props.friendPost.text,
      postId: this.props.friendPost.post_id,
      myUserId: 0,
      friendId: 0,

      // showDeleteAlert: false,
      // deleteModal: false,
    };
  }

  componentDidMount() {
    this.getMyId();
  }

  getMyId = async () => {
    const myId = await getUserId();
    this.setState({
      myUserId: myId,
    });
  };

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

  // todo all working, but errors when liking post already liked...do i need a fix for this?
  // POST/user/user_id/post/post_id/like
  // note. id is id of their profile, not yours!
  likePost = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    const { postId } = this.state;
    // const userId = this.props.route.params.profileId;
    console.log(`friend id: ${friendId} postId: ${postId}`);
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendId}/post/${postId}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          // return response.json;
          // return response.json.toString();
          // return response.json();
          console.log('Thanks for your like!');
        } // todo need to add error handling conditions for other response codes
      })
      .catch((error) => {
        console.log(error);
      });
  };

  removeLike = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    const { postId } = this.state;
    // const userId = this.props.route.params.profileId;
    console.log(`friend id: ${friendId} postId: ${postId}`);
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendId}/post/${postId}/like`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          // return response.json;
          // return response.json.toString();
          console.log('Do one!');
        } // todo need to add error handling conditions for other response codes
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // DELETE/user/{user_id}/post/{post_id}
  deletePost = async (post_id) => {
    const token = await getAuthToken();
    // const id = await getUserId();
    const id = await getFriendId();
    const postId = await getPostId();

    console.log(`Post id: ${post_id}`);

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(`Post ${postId} deleted`);
          this.getPosts(); // todo trying to refresh profile on edit/delete...not working
        } else {
          console.log(response.status);
          console.log(`User Id: ${this.id}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <Text>My ID: {this.state.myUserId}</Text>
        <Text>
          Author ID: {this.state.authorId} {this.state.authorFirstName}{' '}
          {this.state.authorLastName}
        </Text>
        <Text>Post ID: {this.state.postId}</Text>
        <Text>{this.state.postContent}</Text>
        <br />

        {/* conditional rendering for displaying edit/delete and like/remove like */}

        {this.state.myUserId == this.state.authorId ? (
          <View>
            <Text>
              Hi {this.state.firstName}, this is your post so you can edit or
              delete, using the buttons below:-)
            </Text>
            {/* todo edit post not working - nav error thrown in console */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editPostButton}
                onPress={async () => {
                  const p_userId = await getFriendId();
                  const p_userPostId = this.state.postId;
                  console.log(`user id ${p_userId} post id ${p_userPostId}`);
                  this.props.navigation.navigate('MyPost', {
                    p_userId,
                    p_userPostId,
                  });
                }}
              >
                <Text style={styles.editButtonText}>EDIT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                // todo can't get modal working, alert not supported on expo web
                style={styles.deletePostButton}
                onPress={() => {
                  // this.showDeleteAlert();
                  // if (this.state.deleteModal) {
                  this.deletePost(this.state.postId);
                  // })
                }}
              >
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.state.myUserId != this.state.authorId ? (
          <View>
            <Text>
              Sorry, this is not your post. You can like me though :-)
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.likePostButton}
                onPress={() => {
                  this.likePost();
                }}
              >
                <Text style={styles.editButtonText}>LIKE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // todo needs alert but unsupported on web & can't get lib alert working
                style={styles.deletePostButton}
                onPress={() => {
                  this.removeLike();
                }}
              >
                <Text style={styles.deleteButtonText}>UNLIKE</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
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
  likePostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#48b85a',
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
  alertContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#56cb6a',
  },
  confirmButtonText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  cancelButton: {
    width: 100,
    textAlign: 'center',
    backgroundColor: '#f20948',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
});

export default PostManager;
