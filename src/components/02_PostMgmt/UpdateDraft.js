import React from 'react';
import { TextInput, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { updateDraftPost } from '../../utils/AsyncStorage';
/**
 * displays details of a single post<br>
 * used for updating posts from profile page
 */
class MyPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: {},
      draftPost: this.props.route.params.d_post.post,
      o_draftPost: this.props.route.params.d_post.post,
      draftPostId: this.props.route.params.d_post.id,
    };
  }

  render() {
    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>EDIT DRAFT POST</Text>
        </View>
        <View style={GlobalStyles.textInputContainer}>
          <TextInput
            style={GlobalStyles.postTextInput}
            underlineColorAndroid="transparent"
            placeholder={this.state.draftPost}
            placeholderTextColor="#39407c"
            numberOfLines={10}
            multiline
            onChangeText={(value) => this.setState({ draftPost: value })}
            value={this.state.draftPost}
          />
        </View>
        <View style={GlobalStyles.mediumButtonContainer}>
          <TouchableOpacity
            style={GlobalStyles.mediumButton}
            onPress={() => {
              updateDraftPost(
                this.state.draftPost,
                this.state.draftPostId
              ).then(() => {
                this.props.navigation.navigate('AddPost');
              });
            }}
          >
            <Text style={GlobalStyles.buttonText}>UPDATE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={GlobalStyles.mediumButton}
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

export default MyPost;
