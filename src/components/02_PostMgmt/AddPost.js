import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
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
      showAlert: false,
      alertMessage: '',
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
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        if (response.status === 401) {
          this.setState({
            showAlert: true,
            alertMessage: 'Error code 401: Unauthorized',
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
      .then((json) => {
        setPostId(json.id)
          .then(() => {
            if (myId == profileId) {
              this.props.navigation.navigate('MyProfile');
            } else {
              this.props.navigation.navigate('FriendProfile');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
  };

  render() {
    const { showAlert } = this.state;

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
            style={styles.postButtons}
            onPress={() => {
              this.addPost();
            }}
          >
            <Text style={GlobalStyles.buttonText}>POST</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButtons}
            onPress={() => {
              this.props.navigation.navigate('MyProfile');
            }}
          >
            <Text style={GlobalStyles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.smallButtonContainer}>
          <TouchableOpacity
            style={styles.draftPostButtons}
            onPress={() => {
              addDraftPost(this.state.postText);
              this.setState({ postText: '' });
            }}
          >
            <Text style={GlobalStyles.buttonText}>SAVE TO DRAFT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draftPostButtons}
            onPress={() => {
              this.props.navigation.navigate('DraftPosts');
            }}
          >
            <Text style={GlobalStyles.buttonText}>VIEW DRAFTS</Text>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  postButtons: {
    alignItems: 'center',
    width: 170,
    backgroundColor: '#4453ce',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  draftPostButtons: {
    alignItems: 'center',
    width: 170,
    backgroundColor: '#744772',
    paddingVertical: 10,
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
