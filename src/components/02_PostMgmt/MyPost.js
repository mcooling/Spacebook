import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { StyleSheet, TextInput } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, getUserId, getPostId } from '../../utils/AsyncStorage';

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

  // todo i think view and edit are now just about working! check with ash...

  // GET/user/{user_id}/post/{post_id}
  viewPost = async () => {
    const token = await getAuthToken();

    console.log('I am here');

    const user_id = this.props.route.params.p_userId;
    const user_postId = this.props.route.params.p_userPostId;
    console.log(`user details: userid ${user_id} postid ${user_postId}`);

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
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } // todo need to add error handling conditions for other response codes
      })
      .then((responseJson) => {
        this.setState({ post: responseJson });
        this.setState({
          textValue: responseJson.text,
          o_textValue: responseJson.text,
        });
        console.log(`Post ID: ${responseJson.post_id}`);
        console.log(`Post Text: ${responseJson.text}`);
        console.log('Full GET response');
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // PATCH/user/{user_id}/post/{post_id}
  updatePost = async () => {
    const token = await getAuthToken();
    const id = await getUserId();
    const postId = await getPostId();

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
    )
      .then(() => {
        console.log('Update successful');
        console.log(updatedText);
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

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            placeholder={this.state.post.text}
            placeholderTextColor="#39407c"
            numberOfLines={10}
            multiline
            onChangeText={(value) => this.setState({ textValue: value })}
            value={this.state.textValue}
          />
        </View>
        <View style={GlobalStyles.smallButtonContainer}>
          <TouchableOpacity
            style={GlobalStyles.smallButton}
            onPress={() => {
              this.updatePost();
              this.props.navigation.navigate('MyProfile');
            }}
          >
            <Text style={GlobalStyles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.smallButton}
            onPress={() => {
              this.props.navigation.navigate('MyProfile');
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
