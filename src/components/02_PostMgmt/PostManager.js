import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getAuthToken,
  getFriendId,
  getPostId,
  getUserId,
} from '../../utils/AsyncStorage';
import { errorCodes } from '../../utils/ErrorCodes';

/**
 * handles CRUD and Like/Unlike functions, on posts to friend profiles<br>
 * instantiated in FriendProfile View
 */
class PostManager extends React.Component {
  constructor(props) {
    super(props);

    // takes in props from FriendProfile
    this.state = {
      authorId: this.props.friendPost.author.user_id,
      authorFirstName: this.props.friendPost.author.first_name,
      authorLastName: this.props.friendPost.author.last_name,
      postContent: this.props.friendPost.text,
      postId: this.props.friendPost.post_id,
      numLikes: this.props.friendPost.numlikes,
      myUserId: 0,
      showAlert: false,
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

  /**
   * fetches list of friends posts
   * @returns GET/user/user_id/post/ API call
   */
  getPosts = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();

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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * posts a like to a friends profile<br>
   * passes friend id<br>
   * @returns POST/user/user_id/post/post_id/like API call
   */
  likePost = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    const { postId } = this.state;
    // console.log(`friend id: ${friendId} postId: ${postId}`);

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendId}/post/${postId}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      }
    ) // todo need to add error handling conditions for other response codes
      .then((response) => {
        if (response.status === 200) {
          console.log('Thanks for your like!');
        }
        if (response.status === 400 || response.status === 403) {
          console.log('User has already liked this post');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * removes a like from a friends profile<br>
   * passes friend id<br>
   * @returns DELETE/user/user_id/post/post_id/like API call
   */
  removeLike = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    const { postId } = this.state;
    // console.log(`friend id: ${friendId} postId: ${postId}`);

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
          console.log('Rude!');
        } // todo need to add error handling conditions for other response codes
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * deletes a post made to a friends profile<br>
   * passes friend id<br>
   * @returns POST/user/user_id/post/post_id/like API call
   */
  deletePost = async (post_id) => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    const postId = await getPostId();

    console.log(`Post id: ${post_id}`);

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${friendId}/post/${post_id}`,
      {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          console.log(`Post ${postId} deleted`);
          this.getPosts();
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
        <Text style={styles.postText}>{this.state.postContent}</Text>
        {this.state.myUserId == this.state.authorId ? (
          <View>
            <View style={styles.smallButtonContainer}>
              <TouchableOpacity
                style={styles.editPostButton}
                onPress={async () => {
                  const p_userId = await getFriendId();
                  // const p_userId = this.state.myUserId;
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
                style={styles.deletePostButton}
                onPress={() => {
                  this.deletePost(this.state.postId);
                }}
              >
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.state.myUserId != this.state.authorId ? (
          <View>
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
                style={styles.unlikePostButton}
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
    paddingRight: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  smallButtonContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editPostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#f59f0f',
    marginVertical: 10,
    borderRadius: 5,
  },
  deletePostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#eb083a',
    marginVertical: 10,
    borderRadius: 5,
  },
  likePostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#48b85a',
    marginVertical: 10,
    borderRadius: 5,
  },
  unlikePostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#eb083a',
    marginVertical: 10,
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

export default PostManager;
