import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, updateDraftPost } from '../../utils/AsyncStorage';
import { errorCodes } from '../../utils/ErrorCodes';
/**
 * displays details of a single post<br>
 * used for updating posts from profile page
 */
class MyPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: {},
      // draftPostobject: this.props.route.params.d_post.post,
      draftPost: this.props.route.params.d_post.post,
      o_draftPost: this.props.route.params.d_post.post,
      draftPostId: this.props.route.params.d_post.id,
    };
  }

  /**
   * fetches details of post selected
   * @returns GET/user/user_id/post/post_id API call
   */
  // viewPost = async () => {
  //   const token = await getAuthToken();
  //
  //   console.log('I am here');
  //
  //   const user_id = this.props.route.params.p_userId;
  //   const user_postId = this.props.route.params.p_userPostId;
  //   console.log(`user details: userid ${user_id} postid ${user_postId}`);
  //
  //   this.setState({
  //     userId: user_id,
  //     postId: user_postId,
  //   });
  //
  //   return fetch(
  //     `http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`,
  //     {
  //       headers: {
  //         'X-Authorization': token,
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       if (response.status === 200) {
  //         return response.json();
  //       }
  //     })
  //     .then((responseJson) => {
  //       this.setState({ post: responseJson });
  //       this.setState({
  //         textValue: responseJson.text,
  //         o_textValue: responseJson.text,
  //       });
  //       console.log(`Post ID: ${responseJson.post_id}`);
  //       console.log(`Post Text: ${responseJson.text}`);
  //       console.log('Full GET response');
  //       console.log(responseJson);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  /**
   * posts updates to post content
   * @returns PATCH/user/user_id/post/post_id API call
   */
  // updatePost = async () => {
  //   const token = await getAuthToken();
  //   const updatedText = {};
  //
  //   if (this.state.draftPost !== this.state.o_draftPost) {
  //     updatedText.text = this.state.draftPost;
  //   }
  //
  //   return fetch(
  //     `http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`,
  //     {
  //       method: 'PATCH',
  //       headers: {
  //         'X-Authorization': token,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedText),
  //     }
  //   )
  //     .then(() => {
  //       console.log('Update successful');
  //       console.log(updatedText);
  //       this.props.navigation.navigate('MyProfile');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  render() {
    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>EDIT DRAFT POST</Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder={this.state.draftPost}
            placeholderTextColor="#39407c"
            numberOfLines={10}
            multiline
            onChangeText={(value) => this.setState({ draftPost: value })}
            value={this.state.draftPost}
          />
        </View>
        <View style={GlobalStyles.smallButtonContainer}>
          <TouchableOpacity
            style={GlobalStyles.smallButton}
            onPress={() => {
              updateDraftPost(
                this.state.draftPost,
                this.state.draftPostId
              ).then(() => {
                this.props.navigation.navigate('DraftPosts');
              });
            }}
          >
            <Text style={GlobalStyles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.smallButton}
            onPress={() => {
              this.props.navigation.navigate('DraftPosts');
            }}
          >
            <Text style={GlobalStyles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postText: {
    fontSize: 15,
    paddingTop: 10,
    // paddingLeft: 20,
    // alignContent: "center",
    alignItems: 'center',
  },
  textInput: {
    fontSize: 17,
    paddingTop: 10,
    paddingLeft: 10,
    borderColor: '#bdbed9',
    borderWidth: 1,
    // outlineStyle: 'none',
  },
  textInputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
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

export default MyPost;
