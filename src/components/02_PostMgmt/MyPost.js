import React from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken } from '../../utils/AsyncStorage';
import { updateSinglePost, viewSinglePost } from '../../utils/APIEndpoints';

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
      showAlert: false,
      alertMessage: '',
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
    this.setState({
      userId: this.props.route.params.p_userId,
      postId: this.props.route.params.p_userPostId,
    });
    viewSinglePost(this.state.userId, this.state.postId, token)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 403) {
          this.setState({
            showAlert: true,
            alertMessage:
              'Error code 403: You can only view the posts of yourself or your friends',
          });
        }
        if (response.status === 404) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .then((responseJson) => {
        this.setState({ post: responseJson });
        this.setState({
          textValue: responseJson.text,
          o_textValue: responseJson.text,
        });
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
    await updateSinglePost(
      this.state.userId,
      this.state.postId,
      token,
      updatedText
    )
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        if (response.status === 400) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 400: Bad Request',
          });
        }
        if (response.status === 401) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
          });
        }
        if (response.status === 403) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 403: You can only update your own posts',
          });
        }
        if (response.status === 404) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 404: Not Found',
          });
        }
        if (response.status === 500) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 500: Server Error',
          });
        }
      })
      .then(() => {
        if (this.state.userId == this.state.post.author.user_id) {
          this.props.navigation.navigate('MyProfile');
        } else {
          this.props.navigation.navigate('FriendProfile');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { showAlert } = this.state;

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
              this.updatePost();
            }}
          >
            <Text style={GlobalStyles.buttonText}>UPDATE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.mediumButton}
            onPress={() => {
              if (this.state.userId == this.state.post.author.user_id) {
                this.props.navigation.navigate('MyProfile');
              } else {
                this.props.navigation.navigate('FriendProfile');
              }
            }}
          >
            <Text style={GlobalStyles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Alert"
          titleStyle={GlobalStyles.alertTitleText}
          message={this.state.alertMessage}
          messageStyle={GlobalStyles.alertMessageText}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showConfirmButton
          confirmText="OK"
          confirmButtonStyle={GlobalStyles.alertConfirmButton}
          confirmButtonTextStyle={GlobalStyles.alertConfirmButtonText}
          onConfirmPressed={() => {
            this.setState({ showAlert: false });
          }}
        />
      </View>
    );
  }
}

export default MyPost;
