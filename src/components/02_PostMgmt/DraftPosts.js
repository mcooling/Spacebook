import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  deleteDraftPost,
  getAuthToken,
  getDraftPost,
  getUserId,
  setPostId,
} from '../../utils/AsyncStorage';
import GlobalStyles from '../../utils/GlobalStyles';

/**
 * handles draft post functionality
 * view, post, update, delete functions
 * interacts with functions in async storage
 */
class DraftPosts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // add state variables
      drafts: [],
      o_postText: '',
      postText: '',
    };
  }

  componentDidMount() {
    // add code here
    this.getDraft();
  }

  /**
   * gets draft posts for view
   * interacts with async storage function
   */
  getDraft = () => {
    getDraftPost().then((response) => {
      this.setState({
        drafts: response,
      });
      console.log(response);
    });
  };

  /**
   * posts draft to user profile
   * @param postText passed from view draft
   * @returns POST/user/user_id/post API call
   */
  postDraft = async (postText) => {
    const token = await getAuthToken();
    const userId = await getUserId();

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        text: postText,
      }),
    }) // todo add error handling - speak to nath
      .then((response) => response.json())
      .then((json) => {
        console.log(`Post successful. Post ID: ${json.id}`);
        console.log(json);
        setPostId(json.id).catch((error) => {
          console.log(`Post unsuccessful: ${error}`);
        });
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
      <View>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>DRAFT POSTS</Text>
          <Text
            style={{ color: 'white', fontSize: 20 }}
            onPress={() => {
              this.props.navigation.navigate('AddPost');
            }}
          >
            BACK TO POSTS
          </Text>
        </View>
        <View style={GlobalStyles.friendsContainer}>
          <FlatList
            data={this.state.drafts}
            renderItem={({ item }) => (
              <View style={styles.flatListColumnView}>
                <Text style={{ fontSize: 17 }}>{item.post}</Text>
                <View style={styles.flatListRowView}>
                  <TouchableOpacity
                    style={styles.postDraftButton}
                    onPress={() => {
                      // setFriendId(item.user_id);
                      this.postDraft(item.post).then(() => {
                        deleteDraftPost(item.id).then(() => {
                          this.getDraft();
                        });
                      });
                      console.log(`Post id: ${item.id}`);
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>POST</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.updateDraftButton}
                    onPress={() => {
                      const d_post = item;
                      // console.log(`user id ${p_userId} post id ${p_userPostId}`);
                      this.props.navigation.navigate('UpdateDraft', {
                        d_post,
                      });
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>UPDATE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteDraftButton}
                    onPress={() => {
                      deleteDraftPost(item.id).then(() => {
                        this.getDraft();
                      });
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>DELETE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    );
  }
}

export default DraftPosts;

const styles = StyleSheet.create({
  postDraftButton: {
    alignItems: 'center',
    width: 110,
    backgroundColor: '#45732b',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  updateDraftButton: {
    alignItems: 'center',
    width: 110,
    backgroundColor: '#ea6129',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteDraftButton: {
    alignItems: 'center',
    width: 110,
    backgroundColor: '#dc0b2b',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    marginRight: 10,
    borderRadius: 5,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#9c20c6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flatListColumnView: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  flatListRowView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
