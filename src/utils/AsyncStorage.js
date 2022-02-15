import AsyncStorage from "@react-native-async-storage/async-storage";

// sets auth token value. called at login
export const setAuthToken = async (value) => {
  try {
    // const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@auth_token", value);
  } catch (error) {
    console.error(error);
  }
};

// gets auth token. required by all API calls needing x-auth
export const getAuthToken = async () => {
  try {
    const tokenValue = await AsyncStorage.getItem("@auth_token");
    console.log(tokenValue);
    // return tokenValue != null ? JSON.parse(tokenValue) : null;
    return tokenValue;
  } catch (error) {
    console.error(error);
  }
};

// deletes auth token value from current session. called at logout
export const deleteAuthToken = async () => {
  await AsyncStorage.removeItem("@auth_token");
};

// sets user_id value. called at login
export const setUserId = async (value) => {
  try {
    console.log(value);
    // const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@user_id", value);
  } catch (error) {
    console.error(error);
  }
};

// gets user_id value. required by all API calls needing user id
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("@user_id");
    console.log(userId);
    // return userId != null ? JSON.parse(userId) : null;
    return userId;
  } catch (error) {
    console.error(error);
  }
};
