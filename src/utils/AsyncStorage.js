import AsyncStorage from '@react-native-async-storage/async-storage';

// sets auth token value. called at login
export const setAuthToken = async (value) => {
  try {
    await AsyncStorage.setItem('@auth_token', value);
  } catch (error) {
    console.error(error);
  }
};

// gets user_id value. required by all API calls needing user id
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('@user_id');
    // console.log(`get user id = ${userId}`);
    return userId;
  } catch (error) {
    console.error(error);
  }
};

// sets user_id value. called at login
export const setUserId = async (value) => {
  try {
    await AsyncStorage.setItem('@user_id', value);
    // console.log(`set user id = ${value}`);
  } catch (error) {
    console.error(error);
  }
};

// sets friend user_id value. called in MyFriends flatlist
export const setFriendId = async (value) => {
  try {
    await AsyncStorage.setItem('@friend_id', value);
    // console.log(`set friend id = ${value}`);
  } catch (error) {
    console.error(error);
  }
};

// gets friend user_id value
export const getFriendId = async () => {
  try {
    const friendId = await AsyncStorage.getItem('@friend_id');
    // console.log(`get friend id = ${friendId}`);
    return friendId;
  } catch (error) {
    console.error(error);
  }
};

// gets auth token. required by all API calls needing x-auth
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    return token;
  } catch (error) {
    console.error(error);
  }
};

// deletes auth token value from current session. called at logout
export const deleteAuthToken = async () => {
  await AsyncStorage.removeItem('@auth_token');
};

// sets post_id value. called at add post
export const setPostId = async (value) => {
  try {
    await AsyncStorage.setItem('@post_id', value);
  } catch (error) {
    console.error(error);
  }
};

// gets post id, required to delete posts
export const getPostId = async () => {
  try {
    const postId = await AsyncStorage.getItem('@post_id');
    return postId;
  } catch (error) {
    console.error(error);
  }
};
