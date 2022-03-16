import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import {
  getAuthToken,
  setPostId,
  addDraftPost,
  getUserId,
} from '../../utils/AsyncStorage';
import { addNewPost } from '../../utils/APIEndpoints';

/**
 * handles add post, to user & friend profiles
 */
class AddPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postText: '',
      user_id: 0,
    };
  }

  /**
   * @returns POST/user/user_id/post API call
   * adds new post to user profile
   */
  addPost = async () => {
    const token = await getAuthToken();
    const userId = this.props.route.params.profileId;
    const { profileId } = this.props.route.params;
    const myId = await getUserId();
    this.setState({
      user_id: await getUserId(),
    });
    addNewPost(userId, token, this.state.postText)
      // todo add error handling - speak to nath
      .then((response) => response.json())
      .then((json) => {
        console.log(`Post successful. Post ID: ${json.id}`);
        console.log(
          `User id is ${this.state.user_id} and friend profile id is ${profileId}`
        );
        setPostId(json.id)
          .then(() => {
            // todo this nav still isn't working - going to friend profile
            //  see github
            if (myId == profileId) {
              this.props.navigation.navigate('MyProfile');
            } else {
              this.props.navigation.navigate('FriendProfile');
            }
          })
          .catch((error) => {
            console.log(`Post unsuccessful: ${error}`);
          });
      });
  };

  render() {
    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>ADD POST</Text>
        </View>
        <View style={styles.container}>
          <TextInput
            style={GlobalStyles.postTextInput}
            underlineColorAndroid="transparent"
            placeholder="What's on your mind?"
            placeholderTextColor="#39407c"
            numberOfLines={10}
            multiline
            onChangeText={(value) => this.setState({ postText: value })}
            value={this.state.postText}
          />
        </View>
        <View style={styles.smallButtonContainer}>
          <TouchableOpacity
            style={GlobalStyles.mediumButton}
            onPress={() => {
              this.addPost();
            }}
          >
            <Text style={GlobalStyles.buttonText}>POST</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addPostButton}
            onPress={() => {
              this.props.navigation.navigate('MyProfile');
            }}
          >
            <Text style={GlobalStyles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.smallButtonContainer}>
          <TouchableOpacity
            style={styles.draftPostButton}
            onPress={() => {
              addDraftPost(this.state.postText);
              this.setState({ postText: '' });
            }}
          >
            <Text style={GlobalStyles.buttonText}>SAVE TO DRAFT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draftPostButton}
            onPress={() => {
              this.props.navigation.navigate('DraftPosts');
            }}
          >
            <Text style={GlobalStyles.buttonText}>VIEW DRAFTS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  addPostButton: {
    alignItems: 'center',
    width: 170,
    // backgroundColor: '#6369b8',
    backgroundColor: '#4453ce',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  draftPostButton: {
    alignItems: 'center',
    width: 170,
    // backgroundColor: '#6369b8',
    backgroundColor: '#744772',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  smallButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
  },
});

export default AddPost;
