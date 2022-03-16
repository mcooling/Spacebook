import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // view containers
  headerContainer: {
    padding: 20,
    backgroundColor: '#9c20c6',
  },
  container: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginLeft: 20,
  },
  loginSignupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendsContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  searchFriendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  mediumButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  borderContainer: {
    height: '100vh',
    width: '100vw',
  },
  textInputContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileParentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  profileHeaderContainer: {
    width: '100vw',
    backgroundColor: '#9c20c6',
    padding: 20,
  },
  profileContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // text styles
  screenTitle: {
    alignItems: 'center',
    fontSize: 20,
    color: '#efeff7',
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 20,
    paddingTop: 25,
    paddingLeft: 20,
    alignItems: 'center',
    outlineStyle: 'none',
  },
  postTextInput: {
    fontSize: 17,
    paddingTop: 10,
    paddingLeft: 10,
    borderColor: '#bdbed9',
    borderWidth: 1,
  },
  searchUserTextInput: {
    fontSize: 21,
    paddingVertical: 20,
    outlineStyle: 'none',
  },
  profileTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 16,
    paddingLeft: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    alignContent: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendText: {
    fontSize: 14,
    paddingTop: 10,
    paddingLeft: 20,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileTextName: {
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },

  // button styles
  mediumButton: {
    alignItems: 'center',
    width: 170,
    backgroundColor: '#6369b8',
    marginRight: 10,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  searchButtons: {
    alignItems: 'center',
    width: 80,
    backgroundColor: '#6369b8',
    marginRight: 10,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  invisibleButton: {
    alignItems: 'center',
    width: 170,
    backgroundColor: 'transparent',
    marginRight: 10,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6369b8',
    marginHorizontal: 20,
    padding: 10,
    // marginLeft: 120,
    marginTop: 20,
    borderRadius: 5,
  },
  friendRequestButton: {
    alignItems: 'center',
    backgroundColor: '#6369b8',
    marginHorizontal: 10,
    padding: 10,
    width: 100,
    marginTop: 20,
    borderRadius: 5,
  },
  friendButton: {
    alignItems: 'center',
    backgroundColor: '#6369b8',
    marginHorizontal: 20,
    padding: 10,
    marginLeft: 120,
    marginTop: 20,
    borderRadius: 5,
  },

  // alert styling
  alertMessageText: {
    color: '#23341c',
    fontSize: 18,
    textAlign: 'center',
  },
  alertTitleText: {
    color: '#23341c',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  alertCancelButton: {
    width: 100,
    textAlign: 'center',
    backgroundColor: '#45732b',
  },
  alertCancelButtonText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  alertConfirmButton: {
    width: 100,
    textAlign: 'center',
    backgroundColor: '#ea0d30',
  },
  alertConfirmButtonText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
