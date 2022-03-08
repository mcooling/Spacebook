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

// adds profile post to draft
// each post pushed to an array

// add first post - calls addDraftPost (setItem)

export const addDraftPost = async (postText) => {
  try {
    // get the existing array
    const draftPostArray = JSON.parse(
      await AsyncStorage.getItem('@draft_post')
    );
    // console.log(draftPostArray);
    // console.log(postText);

    // create new json object to be added
    // todo think i may need more logic here
    // deleting a record doesn't update other ids
    // so post id's no longer match element id for new posts
    // tries to create new record with an id that already exists

    // need to check array for post id values each time?

    const postObject = { id: draftPostArray.length, post: postText };
    console.log(postObject);

    // if item in get, append with the new thing i'm creating, then resend
    // nothing, ned to create first item
    // get current array from async storage - get what's currently stored
    // add new post to end of array
    // add back into async storage
    // need to parse object to json. check the length
    // new id = json.length
    // don't need array.push anymore

    // push new object into existing array
    draftPostArray.push(postObject);

    // update async storage with new array
    await AsyncStorage.setItem('@draft_post', JSON.stringify(draftPostArray));
    console.log(draftPostArray);
  } catch (error) {
    console.error(error);
  }
};

// gets post from draft post array
export const getDraftPost = async () => {
  try {
    const getPostArray = await AsyncStorage.getItem('@draft_post');

    if (getPostArray != null) {
      // we have draft posts
      // console.log(JSON.parse(getPostArray));
      return JSON.parse(getPostArray); // converts string to json object
    }
  } catch (error) {
    console.error(error);
  }
};

// removes post from list of drafts
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

// update draft post
// todo not got this working quite right
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

    // todo console error
    // draftPostArray.update(postId, postText);
    // draftPostArray.postId = postText;
    draftPostArray[draftPostId].post = draftPost;

    // draftPostArray.splice(postId, 1);

    // update async storage with new array
    await AsyncStorage.setItem('@draft_post', JSON.stringify(draftPostArray));
  } catch (error) {
    console.error(error);
  }
};
