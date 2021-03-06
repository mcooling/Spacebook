import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { Component } from 'react';
import { getAuthToken, getUserId } from '../../utils/AsyncStorage';
import { uploadProfilePhoto } from '../../utils/APIEndpoints';

/**
 * lets user update profile picture<br>
 * accesses device camera
 */
class UpdatePhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  /**
   * takes picture, using device camera<br>
   * creates raw image file (base64) <br>
   * passes raw file to server for conversion to blob
   */
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendPhotoToServer(data),
      };
      const data = await this.camera.takePictureAsync(options);
    }
  };

  /**
   * takes raw base64 image file, converts to blob<br>
   * @param data takes raw base64 image file
   * @returns POST/user/user_id/photo API call
   */
  sendPhotoToServer = async (data) => {
    const userId = await getUserId();
    const token = await getAuthToken();
    const rawFile = await fetch(data.base64);
    const blob = await rawFile.blob();

    uploadProfilePhoto(userId, blob, token)
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
        this.props.navigation.navigate('MyProfile');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={(ref) => (this.camera = ref)}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.text}>Take Picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.props.navigation.navigate('MyProfile');
                }}
              >
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return <Text>No access to camera</Text>;
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 140,
  },
  text: {
    fontSize: 18,
    color: 'white',
    width: 150,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    marginLeft: 140,
  },
});

export default UpdatePhoto;
