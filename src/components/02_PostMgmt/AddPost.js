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
   */
  addPost = async () => {
    const token = await getAuthToken();
    const userId = this.props.route.params.profileId;
    this.setState({
      user_id: userId,
    });
    // console.log(`UserId HERE ${userId}`);

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        text: this.state.postText,
      }),
    }) // todo add error handling - speak to nath
      .then((response) => response.json())
      .then((json) => {
        console.log(`Post successful. Post ID: ${json.id}`);
        // console.log(json);
        setPostId(json.id)
          .then(() => {
            if (this.state.user_id == getUserId()) {
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
            style={styles.textInput}
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
            style={styles.addPostButton}
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
  textInput: {
    fontSize: 17,
    paddingTop: 10,
    paddingLeft: 10,
    borderColor: '#bdbed9',
    borderWidth: 1,
    // outlineStyle: 'none',
  },
});

export default AddPost;
