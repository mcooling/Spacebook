import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native-web';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getUserData, getProfilePhoto } from '../../utils/UtilFunctions';
import { getAuthToken, getUserId, getPostId } from '../../utils/AsyncStorage';

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
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // console.log("I'm HERE!!!", this.route);
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

  // GET/user/{user_id}/post
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
        // console.log("GET/user/user_id/post response");
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

  // todo have another look at this. not sure why there's two vars for post id
  // todo still not refreshing consistently, real time
  // DELETE/user/{user_id}/post/{post_id}
  deletePost = async (post_id) => {
    const token = await getAuthToken();
    const id = await getUserId();
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
          this.getPosts(); // refreshes posts
        } else {
          console.log(response.status);
          console.log(`User Id: ${this.id}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // todo is the takeaway from this is that every screen with a view needs 'isLoading'??
  // todo need to sort pagination of posts, and formatting of text display for each post
  render() {
    if (!this.state.isLoading) {
      return (
        <ScrollView>
          <View style={GlobalStyles.headerContainer}>
            <Text style={GlobalStyles.screenTitle}>HOME</Text>
          </View>
          <Text
            style={GlobalStyles.textInput}
            onPress={async () => {
              const profileId = await getUserId();
              console.log(`profile id${profileId}`);
              this.props.navigation.navigate('AddPost', {
                profileId,
              });
            }}
          >
            What's on your mind?
          </Text>
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
            style={styles.profileTextBold}
          >{`${this.state.firstName.toUpperCase()} ${this.state.lastName.toUpperCase()}`}</Text>
          <Text style={styles.profileText}>{`${this.state.emailAddress}`}</Text>
          <View style={GlobalStyles.smallButtonContainer}>
            <TouchableOpacity
              style={GlobalStyles.smallButton}
              onPress={() => {
                this.props.navigation.navigate('MyDetails');
              }}
            >
              <Text style={GlobalStyles.buttonText}>EDIT DETAILS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={GlobalStyles.smallButton}
              onPress={() => {
                this.props.navigation.navigate('UpdatePhoto');
              }}
            >
              <Text style={GlobalStyles.buttonText}>UPDATE PHOTO</Text>
            </TouchableOpacity>
          </View>

          <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.sectionHeader}>My Posts</Text>
            <View>
              <FlatList
                data={this.state.postList}
                renderItem={({ item }) => (
                  <View style={styles.container}>
                    <Text style={styles.postText}>{item.text}</Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.editPostButton}
                        onPress={async () => {
                          const p_userId = await getUserId();
                          const p_userPostId = await getPostId();
                          console.log(
                            `user id ${p_userId} post id ${p_userPostId}`
                          );
                          this.props.navigation.navigate('MyPost', {
                            p_userId,
                            p_userPostId,
                          });
                        }}
                      >
                        <Text style={styles.editButtonText}>EDIT</Text>
                      </TouchableOpacity>

                      {/* todo delete is broken on lennon (seems fine on others)
                      - linked to likes? */}
                      <TouchableOpacity
                        // todo need an 'are you sure' alert/modal here
                        style={styles.deletePostButton}
                        onPress={() => {
                          this.deletePost(item.post_id).then(() => {});
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
          </View>
        </ScrollView>
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

export default MyProfile;
