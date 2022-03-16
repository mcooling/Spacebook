import {
  getAuthToken,
  getFriendId,
  getPostId,
  getUserId,
} from './AsyncStorage';

// GET/user/user_id/friends
// export const getAllFriends = async () => {
//   const token = await getAuthToken(); // get auth token
//   const id = await getUserId(); // get user id
//   return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   });
// };
//
// // GET/user/user_id/
// export const getUserData = async () => {
//   const token = await getAuthToken(); // get auth token
//   const id = await getUserId(); // get user id
//   return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   });
// };
//
// // GET/user/user_id/
// export const getFriendData = async () => {
//   const token = await getAuthToken(); // get auth token
//   const id = await getFriendId(); // get friend user id
//   return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   });
// };
//
// // GET/user/user_id/photo
// export const getProfilePhoto = async () => {
//   const token = await getAuthToken();
//   const id = await getUserId();
//
//   return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   });
// };
//
// // GET/user/user_id/photo
// export const getFriendProfilePhoto = async () => {
//   const token = await getAuthToken();
//   const id = await getFriendId();
//
//   return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   });
// };
//
// export const deletePost = async (post_id) => {
//   const token = await getAuthToken();
//   const friendId = await getFriendId();
//   // const postId = await getPostId();
//
//   console.log(`Post id: ${post_id}`);
//
//   return fetch(
//     `http://localhost:3333/api/1.0.0/user/${friendId}/post/${post_id}`,
//     {
//       method: 'DELETE',
//       headers: {
//         'X-Authorization': token,
//       },
//     }
//   ).then((res) => {
//     return res;
//   });
// };
//
// export const friendMatch = async () => {
//   const token = await getAuthToken();
//   const myId = await getUserId();
//   // const profileId = await getFriendId();
//
//   return fetch(`http://localhost:3333/api/1.0.0/user/${myId}/friends`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   }).then((res) => {
//     return res;
//   });
// };
