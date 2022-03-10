import React from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, getUserId } from '../../utils/AsyncStorage';
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
      textValue: '',
      o_textValue: '',
      userId: 0,
      postId: 0,
    };
  }

  componentDidMount() {
    this.viewPost();
  }

  /**
   * fetches details of post selected
   * @returns GET/user/user_id/post/post_id API call
   */
  viewPost = async () => {
    const token = await getAuthToken();
    // console.log('I am here');
    const user_id = this.props.route.params.p_userId;
    const user_postId = this.props.route.params.p_userPostId;
    // console.log(`user details: userid ${user_id} postid ${user_postId}`);

    this.setState({
      userId: user_id,
      postId: user_postId,
    });

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`,
      {
        headers: {
          'X-Authorization': token,
        },
      }
    ) // todo need to add error handling conditions for other response codes
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 403) {
          console.log(
            'Error code 403: You can only view the posts of yourself or your friends'
          );
        }
        errorCodes(response); // todo not working as expected
      })
      .then((responseJson) => {
        this.setState({ post: responseJson });
        this.setState({
          textValue: responseJson.text,
          o_textValue: responseJson.text,
        });
        // console.log(`Post ID: ${responseJson.post_id}`);
        // console.log(`Post Text: ${responseJson.text}`);
        // console.log('Full GET response');
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * posts updates to post content
   * @returns PATCH/user/user_id/post/post_id API call
   */
  updatePost = async () => {
    const token = await getAuthToken();
    const updatedText = {};

    if (this.state.textValue !== this.state.o_textValue) {
      updatedText.text = this.state.textValue;
    }

    return fetch(
      `http://localhost:3333/api/1.0.0/user/${this.state.userId}/post/${this.state.postId}`,
      {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedText),
      }
    ) // todo add error handling - speak to nath
      .then(() => {
        console.log('Update successful');
        console.log(updatedText);
        this.props.navigation.navigate('MyProfile');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>MY POST</Text>
        </View>
        <View style={GlobalStyles.textInputContainer}>
          <TextInput
            style={GlobalStyles.postTextInput}
            underlineColorAndroid="transparent"
            placeholder={this.state.post.text}
            placeholderTextColor="#39407c"
            numberOfLines={10}
            multiline
            onChangeText={(value) => this.setState({ textValue: value })}
            value={this.state.textValue}
          />
        </View>
        <View style={GlobalStyles.mediumButtonContainer}>
          <TouchableOpacity
            style={GlobalStyles.mediumButton}
            onPress={() => {
              this.updatePost().then(() => {
                if (this.state.userId == getUserId()) {
                  this.props.navigation.navigate('MyProfile');
                } else {
                  this.props.navigation.navigate('FriendProfile');
                }
              });
            }}
          >
            <Text style={GlobalStyles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.mediumButton}
            onPress={() => {
              if (this.state.userId == getUserId()) {
                this.props.navigation.navigate('MyProfile');
              } else {
                this.props.navigation.navigate('FriendProfile');
              }
            }}
          >
            <Text style={GlobalStyles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default MyPost;
