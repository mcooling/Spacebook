import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-web';
import { FlatList, TextInput } from 'react-native';
import GlobalStyles from '../../utils/GlobalStyles';
import { getAuthToken, setFriendId } from '../../utils/AsyncStorage';

class SearchUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
      offset: 0,
      users: [],
      isVisible: false,
    };
  }

  componentDidMount() {
    this.searchUsers();
  }

  // GET/search
  searchUsers = async (currentOffsetValue) => {
    const token = await getAuthToken();

    // todo search_in still to do

    // resets current offset value, so that 'Search' always returns full search
    if (currentOffsetValue > 0) {
      this.setState({ offset: 0 });
    }

    return fetch(
      `http://localhost:3333/api/1.0.0/search?q=${this.state.searchValue}&limit=5&offset=${this.state.offset}`,
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
        console.log(responseJson);
        this.setState({
          users: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { open, value, items } = this.state;

    return (
      <View>
        <View style={GlobalStyles.headerContainer}>
          <Text style={GlobalStyles.screenTitle}>SEARCH USERS</Text>
        </View>
        <View>
          <TextInput
            placeholder="User name: "
            onChangeText={(value) => this.setState({ searchValue: value })}
            value={this.state.searchValue}
            style={GlobalStyles.textInput}
          />
          <View style={GlobalStyles.smallButtonContainer}>
            <TouchableOpacity
              style={GlobalStyles.searchButtons}
              onPress={() => {
                this.searchUsers(this.state.offset);
                this.setState({
                  isVisible: true,
                });
              }}
            >
              <Text style={GlobalStyles.buttonText}>SEARCH</Text>
            </TouchableOpacity>

            {this.state.users.length === 5 && (
              <TouchableOpacity
                style={GlobalStyles.searchButtons}
                onPress={() => {
                  this.state.offset += 5; // handle offset increment
                  this.searchUsers();
                  console.log(`offset value: ${this.state.offset}`);
                  this.setState({
                    isVisible: true,
                  });
                }}
              >
                <Text style={GlobalStyles.buttonText}>NEXT</Text>
              </TouchableOpacity>
            )}

            {this.state.offset > 0 && (
              <TouchableOpacity
                style={GlobalStyles.searchButtons}
                onPress={() => {
                  this.state.offset -= 5; // handle offset increment
                  this.searchUsers();
                  console.log(`offset value: ${this.state.offset}`);
                  this.setState({
                    isVisible: true,
                  });
                }}
              >
                <Text style={GlobalStyles.buttonText}>BACK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <FlatList
          data={this.state.users}
          renderItem={({ item }) => (
            <View style={GlobalStyles.searchFriendContainer}>
              <Text style={GlobalStyles.textInput}>
                {`${item.user_givenname} ${item.user_familyname}`}
              </Text>
              <TouchableOpacity
                style={GlobalStyles.button}
                onPress={() => {
                  setFriendId(item.user_id);
                  console.log(item);
                  this.props.navigation.navigate('FriendProfile');
                }}
              >
                <Text style={GlobalStyles.buttonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />
      </View>
    );
  }
}

export default SearchUsers;
