import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthToken, getFriendId, getUserId } from '../../utils/AsyncStorage';
import { likePost, removeLikePost } from '../../utils/APIEndpoints';

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
      deleteAlert: false,
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
   * posts a like to a friends profile<br>
   * passes friend id<br>
   * @returns POST/user/user_id/post/post_id/like API call
   */
  likeFriendPost = async () => {
    const token = await getAuthToken();
    const friendId = await getFriendId();
    likePost(friendId, this.state.postId, token)
      .then((response) => {
        if (response.status === 200) {
          this.props.alertHandler(
            true,
            false,
            'Thank you for your like!',
            this.state.postId
          );
        }
        if (response.status === 400 || response.status === 403) {
          this.props.alertHandler(
            true,
            false,
            'You have already liked this post.',
            this.state.postId
          );
        }
        if (response.status === 404) {
          this.props.alertHandler(
            true,
            false,
            'Error code 404: Not Found',
            this.state.postId
          );
        }
        if (response.status === 500) {
          this.props.alertHandler(
            true,
            false,
            'Error code 500: Server Error',
            this.state.postId
          );
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
    removeLikePost(friendId, this.state.postId, token)
      .then((response) => {
        if (response.status === 200) {
          this.props.alertHandler(
            true,
            false,
            'Your like has been removed',
            this.state.postId
          );
        }
        if (response.status === 401) {
          this.props.alertHandler(
            true,
            false,
            'Error code 404: Unauthorized',
            this.state.postId
          );
        }
        if (response.status === 403) {
          this.props.alertHandler(
            true,
            false,
            'Forbidden: you have not liked this post.',
            this.state.postId
          );
        }
        if (response.status === 404) {
          this.props.alertHandler(
            true,
            false,
            'Error code 404: Not Found',
            this.state.postId
          );
        }
        if (response.status === 500) {
          this.props.alertHandler(
            true,
            false,
            'Error code 500: Server Error',
            this.state.postId
          );
        }
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
                  this.props.alertHandler(
                    false,
                    true,
                    'Are you sure you want to delete this post?',
                    this.state.postId
                  );
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
                  this.likeFriendPost();
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
