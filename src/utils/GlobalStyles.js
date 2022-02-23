// global styles used across app, e.g. headings, text, button text etc
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: '#8e398b',
  },
  container: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginLeft: 20,
  },
  searchFriendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 20,
    paddingTop: 25,
    paddingLeft: 20,
    // alignContent: "center",
    alignItems: 'center',
  },
  smallButton: {
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
  smallButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6369b8',
    marginHorizontal: 20,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
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
  screenTitle: {
    alignItems: 'center',
    fontSize: 20,
    color: '#efeff7',
    fontWeight: 'bold',
  },
  sectionHeader: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  friendText: {
    fontSize: 14,
    paddingTop: 10,
    paddingLeft: 20,
  },
});
