import { getAuthToken, getFriendId, getUserId } from './AsyncStorage';

// GET/user/user_id/
export const getUserData = async () => {
  const token = await getAuthToken(); // get auth token
  const id = await getUserId(); // get user id
  return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
    headers: {
      'X-Authorization': token,
    },
  });
};

export const getFriendData = async () => {
  const token = await getAuthToken(); // get auth token
  const id = await getFriendId(); // get user id
  return fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
    headers: {
      'X-Authorization': token,
    },
  });
};

// GET/user/user_id/photo
export const getProfilePhoto = async () => {
  const token = await getAuthToken();
  const id = await getUserId();

  return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
    headers: {
      'X-Authorization': token,
    },
  });
};

// GET/user/user_id/photo
export const getFriendProfilePhoto = async () => {
  const token = await getAuthToken();
  const id = await getFriendId();

  return fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
    headers: {
      'X-Authorization': token,
    },
  });
};
