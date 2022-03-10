import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getProfilePhoto, getUserData } from '../../utils/UtilFunctions';
import { getAuthToken, getPostId, getUserId } from '../../utils/AsyncStorage';
import GlobalStyles from '../../utils/GlobalStyles';

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
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      getProfilePhoto()
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

      getUserData()
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
    const id = await getUserId();

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post`, {
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
  deletePost = async (post_id) => {
    const token = await getAuthToken();
    const id = await getUserId();
    const postId = await getPostId();

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/post/${post_id}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    }) // todo need to add error handling conditions for other response codes
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
                    this.deletePost(item.post_id);
                  }}
                >
                  <Text style={styles.deleteButtonText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.post_id.toString()}
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
