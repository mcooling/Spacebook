import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  deleteDraftPost,
  getAuthToken,
  getDraftPost,
  getUserId,
  setPostId,
} from '../../utils/AsyncStorage';
import GlobalStyles from '../../utils/GlobalStyles';
import { addNewPost } from '../../utils/APIEndpoints';

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
      showAlert: false,
      alertMessage: '',
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

    addNewPost(userId, token, postText)
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
        setPostId(json.id).catch((error) => {
          console.log(error);
        });
      });
  };

  render() {
    const { showAlert } = this.state;

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
                      this.postDraft(item.post).then(() => {
                        deleteDraftPost(item.id).then(() => {
                          this.getDraft();
                        });
                      });
                    }}
                  >
                    <Text style={GlobalStyles.buttonText}>POST</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.updateDraftButton}
                    onPress={() => {
                      const d_post = item;
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
