import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getUserData } from '../../utils/UtilFunctions';
import { getAuthToken, getPostId, getUserId } from '../../utils/AsyncStorage';
import GlobalStyles from '../../utils/GlobalStyles';
import {
  deletePost,
  getPostList,
  getProfilePhoto,
  getUserInfo,
} from '../../utils/APIEndpoints';

/**
 * Main user profile page<br>
 * displays profile photo and list of posts
 * allows user to update and delete posts
 */
class MyProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      photo: null,
      isLoading: true,
      postList: [],
      showAlert: false,
      postId: 0,
      alertMessage: '',
    };
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      const token = await getAuthToken();
      const userId = await getUserId();
      getProfilePhoto(userId, token)
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

      getUserInfo(userId, token)
        // getUserData()
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            firstName: responseJson.first_name,
            lastName: responseJson.last_name,
            emailAddress: responseJson.email,
          });
        })
        .catch((error) => {
          console.log(error);
        });

      this.getPosts();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * gets list of user posts
   * @returns GET/user/{user_id}/post API call
   */
  getPosts = async () => {
    const token = await getAuthToken();
    const userId = await getUserId();
    getPostList(userId, token)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } // todo need to add error handling conditions for other response codes
      })
      .then((responseJson) => {
        // console.log('GET/user/user_id/post response');
        // console.log(responseJson);
        this.setState({
          isLoading: false,
          postList: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * handles delete post
   * @param post_id
   * @returns DELETE/user/{user_id}/post/{post_id} API call
   */
  deleteMyPost = async (post_id) => {
    const token = await getAuthToken();
    const userId = await getUserId();
    console.log(post_id);

    deletePost(userId, post_id, token)
      // todo need to add error handling conditions for other response codes
      .then((response) => {
        if (response.status === 200) {
          console.log(`Post ${post_id} deleted`);
          this.getPosts();
        }
        // todo not sure how to handle alert for double like. works differently to post manager, i.e. all in one class
        if (response.status === 400 || response.status === 403) {
          this.setState({
            alertMessage:
              'You cannot delete a post that has been liked. The like has to be removed' +
              ' first',
            showAlert: true,
          });
          // this.showAlert();
        }
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
      <View style={GlobalStyles.profileParentContainer}>
        <View style={GlobalStyles.profileHeaderContainer}>
          <Text style={GlobalStyles.screenTitle}>HOME</Text>
        </View>
        <Text
          style={{ padding: 20, fontSize: 18 }}
          onPress={async () => {
            const profileId = await getUserId();
            this.props.navigation.navigate('AddPost', {
              profileId,
            });
          }}
        >
          What's on your mind?
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: this.state.photo }}
            style={{ width: 350, height: 250 }}
          />
        </View>
        <View style={GlobalStyles.profileContainer}>
          <View>
            <Text
              style={GlobalStyles.profileTextName}
            >{`${this.state.firstName.toUpperCase()} ${this.state.lastName.toUpperCase()}`}</Text>
            <Text
              style={{ paddingBottom: 8, fontSize: 18 }}
            >{`${this.state.emailAddress}`}</Text>
          </View>
          <View style={styles.mediumButtonContainer}>
            <TouchableOpacity
              style={styles.mediumButton}
              onPress={() => {
                this.props.navigation.navigate('MyDetails');
              }}
            >
              <Text style={styles.mediumButtonText}>EDIT DETAILS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mediumButton}
              onPress={() => {
                this.props.navigation.navigate('UpdatePhoto');
              }}
            >
              <Text style={styles.mediumButtonText}>UPDATE PHOTO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingLeft: 20, paddingBottom: 10 }}>
          <Text style={GlobalStyles.profileText}>My Posts</Text>
        </View>
        <FlatList
          data={this.state.postList}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Text style={styles.postText}>{item.text}</Text>
              <View style={styles.smallButtonContainer}>
                <TouchableOpacity
                  style={styles.editPostButton}
                  onPress={async () => {
                    const p_userId = await getUserId();
                    const p_userPostId = item.post_id;
                    // console.log(`user id ${p_userId} post id ${p_userPostId}`);
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
                    this.setState({
                      alertMessage:
                        'Are you sure you want to delete this message?',
                      showAlert: true,
                      postId: item.post_id,
                    });
                    // console.log(this.state.postId);
                    // this.showAlert();
                    // this.deletePost(this.state.postId);
                  }}
                >
                  <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
        />
        {/* todo not sure how to handle alt message */}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
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
            this.hideAlert();
          }}
          showConfirmButton
          confirmText="Delete"
          confirmButtonStyle={GlobalStyles.alertConfirmButton}
          confirmButtonTextStyle={GlobalStyles.alertConfirmButtonText}
          onConfirmPressed={() => {
            this.deleteMyPost(this.state.postId).then(() => {
              this.hideAlert();
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mediumButton: {
    backgroundColor: '#4453ce',
    width: 130,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  mediumButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    paddingVertical: 10,
  },
  mediumButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  postContainer: {
    paddingLeft: 20,
  },
  postText: {
    fontSize: 15,
    paddingTop: 10,
    alignItems: 'center',
  },
  smallButtonContainer: {
    flexDirection: 'row',
  },
  editPostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#f59f0f',
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
  deletePostButton: {
    marginRight: 10,
    width: 70,
    backgroundColor: '#eb083a',
    marginVertical: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    fontSize: 12,
    color: 'white',
    paddingVertical: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyProfile;
