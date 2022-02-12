// global styles used across app, e.g. headings, text, button text etc
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  textInput: {
    fontSize: 20,
    paddingTop: 20,
    paddingLeft: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#6369b8",
    marginHorizontal: 20,
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  screenTitle: {
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    alignItems: "flex-start",
    marginTop: 20,
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
