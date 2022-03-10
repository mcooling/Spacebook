import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * sets auth token value. called at login
 * @param value auth token
 */
export const setAuthToken = async (value) => {
  try {
    await AsyncStorage.setItem('@auth_token', value);
  } catch (error) {
    console.error(error);
  }
};

/**
 * gets user_id value
 * required by all API calls needing user id
 * @returns user id
 */
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem('@user_id');
    // console.log(`get user id = ${userId}`);
    return userId;
  } catch (error) {
    console.error(error);
  }
};

/**
 * sets user_id value. called at login
 * @param value user id
 */
export const setUserId = async (value) => {
  try {
    await AsyncStorage.setItem('@user_id', value);
    // console.log(`set user id = ${value}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * sets friend user_id value
 * called in MyFriends flatlist
 * @param value friend user id
 */
export const setFriendId = async (value) => {
  try {
    await AsyncStorage.setItem('@friend_id', value);
    // console.log(`set friend id = ${value}`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * gets friend user_id value
 * @returns friend id
 */
export const getFriendId = async () => {
  try {
    const friendId = await AsyncStorage.getItem('@friend_id');
    // console.log(`get friend id = ${friendId}`);
    return friendId;
  } catch (error) {
    console.error(error);
  }
};

/**
 * gets auth token
 * required by all API calls needing x-auth
 * @returns auth token
 */
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    return token;
  } catch (error) {
    console.error(error);
  }
};

/**
 * deletes auth token value from current session.
 * called at logout
 */
export const deleteAuthToken = async () => {
  await AsyncStorage.removeItem('@auth_token');
};

/**
 * sets post_id value. called at add post
 * @param value post id
 */
export const setPostId = async (value) => {
  try {
    await AsyncStorage.setItem('@post_id', value);
  } catch (error) {
    console.error(error);
  }
};

/**
 * gets post id, required to delete posts
 * @returns post id
 */
export const getPostId = async () => {
  try {
    const postId = await AsyncStorage.getItem('@post_id');
    return postId;
  } catch (error) {
    console.error(error);
  }
};

/**
 * adds a draft post to async storage
 * @param postText draft post text
 */
export const addDraftPost = async (postText) => {
  try {
    // get the existing array
    const draftPostArray = JSON.parse(
      await AsyncStorage.getItem('@draft_post')
    );

    // create new object to add to array
    const postObject = { id: draftPostArray.length, post: postText };
    console.log(postObject);

    draftPostArray.push(postObject);

    // update async storage with new array
    await AsyncStorage.setItem('@draft_post', JSON.stringify(draftPostArray));
    console.log(draftPostArray);
  } catch (error) {
    console.error(error);
  }
};

/**
 * gets post from draft post array
 * @returns {Promise<any>}
 */
export const getDraftPost = async () => {
  try {
    const getPostArray = await AsyncStorage.getItem('@draft_post');

    if (getPostArray != null) {
      return JSON.parse(getPostArray); // converts string to json object
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * removes post from list of drafts
 * @param postId draft post id
 */
export const deleteDraftPost = async (postId) => {
  try {
    // get the existing array
    const draftPostArray = JSON.parse(
      await AsyncStorage.getItem('@draft_post')
    );
    console.log(draftPostArray);
    console.log(`Post id to be deleted: ${postId}`);

    draftPostArray.splice(postId, 1);

    // reindex array elements after deleting an item
    while (postId < draftPostArray.length) {
      draftPostArray[postId].id--;
      postId++;
    }

    // update async storage with new array
    await AsyncStorage.setItem('@draft_post', JSON.stringify(draftPostArray));
  } catch (error) {
    console.error(error);
  }
};

/**
 * update existing draft post
 * @param draftPost draft post text
 * @param draftPostId draft post id
 */
export const updateDraftPost = async (draftPost, draftPostId) => {
  try {
    // get the existing array
    const draftPostArray = JSON.parse(
      await AsyncStorage.getItem('@draft_post')
    );
    console.log(draftPostArray);
    console.log(
      `Update post id ${draftPostId} with new text value ${draftPost}`
    );

    draftPostArray[draftPostId].post = draftPost;

    // update async storage with new array
    await AsyncStorage.setItem('@draft_post', JSON.stringify(draftPostArray));
  } catch (error) {
    console.error(error);
  }
};
