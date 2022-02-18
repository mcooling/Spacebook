import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native-web";
import { TextInput } from "react-native";
import GlobalStyles from "../../utils/GlobalStyles";
import { getUserId, getAuthToken } from "../../utils/AsyncStorage";

class AddPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postText: "",
    };
  }

  // todo go through lint warnings with Ash

  // GET/user/user_id/post
  addPost = async () => {
    const token = await getAuthToken();
    const userId = await getUserId();

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
      },
      body: JSON.stringify({
          text: this.state.postText,
      }),
    })
        .then((response) => response.json())
        .then((json) => {
            console.log("Post successful");
            console.log(json);
        })
        .catch((error) => {
            // todo may want to display a modal / alert here?
            console.log(`Post unsuccessful: ${error}`);
        })
  };

  render() {
    return (
      <View>
        <View style={GlobalStyles.container}>
          <Text style={GlobalStyles.screenTitle}>ADD POST</Text>
        </View>

        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholder="What's on your mind?"
                placeholderTextColor={"#39407c"}
                numberOfLines={10}
                multiline={true}
                onChangeText={(value) => this.setState({ postText: value })}
                value={this.state.postText}

            />
        </View>

        <View style={GlobalStyles.smallButtonContainer}>
            <TouchableOpacity
                style={GlobalStyles.smallButton}
                onPress={() => {
                    this.addPost();
                }}
            >
                <Text style={GlobalStyles.buttonText}>POST</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={GlobalStyles.smallButton}
                onPress={() => {
                    this.props.navigation.navigate("Home");
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

    container: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    textInput: {
        fontSize: 17,
        paddingTop: 10,
        paddingLeft: 10,
        borderColor: "#bdbed9",
        borderWidth: 1,
        outlineStyle: "none",
    },
});

export default AddPost;