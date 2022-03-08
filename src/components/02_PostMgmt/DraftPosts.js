// todo extension task 1 - add option to save draft posts

// save post to async storage, in an array
// page view allows view, update and delete drafts
// contains a submit button

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  deleteDraftPost,
  getAuthToken,
  getDraftPost,
  getPostId,
  getUserId,
  setFriendId,
  setPostId,
  updateDraftPost,
} from '../../utils/AsyncStorage';
import GlobalStyles from '../../utils/GlobalStyles';

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

  getDraft = () => {
    getDraftPost().then((response) => {
      this.setState({
        drafts: response,
      });
      console.log(response);
    });
  };

  postDraft = async (postText) => {
    const token = await getAuthToken();
    const userId = await getUserId();
    console.log(`UserId HERE ${userId}`);

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        text: postText,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(`Post successful. Post ID: ${json.id}`);
        console.log(json);
        setPostId(json.id).catch((error) => {
          console.log(`Post unsuccessful: ${error}`);
        });
      });
  };

  updateDraft = async () => {
    const updatedText = {};

    if (this.state.postText !== this.state.o_postText) {
      updatedText.text = this.state.postText;
    }
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
              <View
                style={{
                  flexDirection: 'column',
                  paddingTop: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{ fontSize: 17 }}>{item.post}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  {/* todo buttons need binding to post/update/delete */}
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
                      // todo update draft function
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
        {/* <View style={GlobalStyles.container}> */}
        {/*  <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 10 }}> */}
        {/*    Friend Requests */}
        {/*  </Text> */}
        {/*  <FlatList */}
        {/*    data={this.state.friendRequests} */}
        {/*    renderItem={({ item }) => ( */}
        {/*      <View> */}
        {/*        <Text style={GlobalStyles.textInput}> */}
        {/*          {`${item.first_name} ${item.last_name}`} */}
        {/*        </Text> */}
        {/*        <View style={{ flexDirection: 'row', paddingLeft: 20 }}> */}
        {/*          <TouchableOpacity */}
        {/*            style={GlobalStyles.friendRequestButton} */}
        {/*            onPress={() => { */}
        {/*              this.acceptFriendRequest(item.user_id); */}
        {/*            }} */}
        {/*          > */}
        {/*            <Text style={GlobalStyles.buttonText}>ACCEPT</Text> */}
        {/*          </TouchableOpacity> */}
        {/*          <TouchableOpacity */}
        {/*            style={GlobalStyles.friendRequestButton} */}
        {/*            onPress={() => { */}
        {/*              this.rejectFriendRequest(item.user_id); */}
        {/*            }} */}
        {/*          > */}
        {/*            <Text style={GlobalStyles.buttonText}>REJECT</Text> */}
        {/*          </TouchableOpacity> */}
        {/*        </View> */}
        {/*      </View> */}
        {/*    )} */}
        {/*    keyExtractor={(item) => item.user_id.toString()} */}
        {/*  /> */}
        {/* </View> */}
      </View>
    );
  }
}

export default DraftPosts;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
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
  headerContainer: {
    padding: 20,
    backgroundColor: '#4453ce',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
