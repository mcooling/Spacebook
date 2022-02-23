import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { Component } from 'react';
import { getAuthToken, getUserId } from '../../utils/AsyncStorage';

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
    // console.log(this.state.hasPermission);
  }

  // takes picture, creates raw image file (base64)
  // passes to server for conversion
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendPhotoToServer(data),
      };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  // takes raw base64 image file, converts to blob
  sendPhotoToServer = async (data) => {
    const id = await getUserId();
    const token = await getAuthToken();

    const rawFile = await fetch(data.base64);
    const blob = await rawFile.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': token,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added', response);
        this.props.navigation.navigate('MyProfile');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
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
            </View>
          </Camera>
        </View>
      );
    }
    return <Text>No access to camera</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
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
