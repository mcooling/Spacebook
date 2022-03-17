import { getAuthToken, getUserId } from './AsyncStorage';

/** USER MANAGEMENT ENDPOINTS */

// POST/user
export const addNewUser = async (first_name, last_name, email, password) => {
  return fetch('http://localhost:3333/api/1.0.0/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      password,
    }),
  }).then((response) => {
    return response;
  });
};

// POST/login
export const login = async (email, password) => {
  return fetch('http://localhost:3333/api/1.0.0/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((response) => {
    return response;
  });
};

// POST/logout
export const logout = async (token) => {
  return fetch('http://localhost:3333/api/1.0.0/logout/', {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
  }).then((response) => {
    return response;
  });
};

// GET/user/{user_id}
export const getUserInfo = async (userId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
    headers: {
      'X-Authorization': token,
    },
  }).then((response) => {
    return response;
  });
};

// PATCH/user/{user_id}
export const updateUserInfo = async (userId, token, patchRequestBody) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'X-Authorization': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchRequestBody),
  }).then((response) => {
    return response;
  });
};

// GET/user/{user_id}/photo
export const getProfilePhoto = async (userId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
    headers: {
      'X-Authorization': token,
    },
  });
};

// POST/user/{user_id}/photo
export const uploadProfilePhoto = async (userId, blob, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/png',
      'X-Authorization': token,
    },
    body: blob,
  }).then((response) => {
    return response;
  });
};

/** FRIEND MANAGEMENT ENDPOINTS */

// GET/user/{user_id}/friends
export const getFriendsList = async (userId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
    headers: {
      'X-Authorization': token,
    },
  }).then((response) => {
    return response;
  });
};

// GET/user/{user_id}/friends
// todo think this is an obsolete
// export const getAllFriends = async () => {
//   const token = await getAuthToken(); // get auth token
//   const id = await getUserId(); // get user id
//   return fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
//     headers: {
//       'X-Authorization': token,
//     },
//   });
// };

// POST/user/{user_id}/friends
export const addFriend = async (friendId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${friendId}/friends`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
  }).then((response) => {
    return response;
  });
};

// GET/friendrequests
export const getFriendRequests = async (token) => {
  return fetch('http://localhost:3333/api/1.0.0/friendrequests/', {
    headers: {
      'X-Authorization': token,
    },
  }).then((res) => {
    return res;
  });
};

// POST/friendrequests/{user_id}
export const acceptFriendRequest = async (userId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
    method: 'POST',
    headers: {
      'X-Authorization': token,
    },
  }).then((res) => {
    return res;
  });
};

// DELETE/friendrequests/{user_id}
export const rejectFriendRequest = async (userId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/friendrequests/${userId}`, {
    method: 'DELETE',
    headers: {
      'X-Authorization': token,
    },
  }).then((response) => {
    return response;
  });
};

// GET/search
export const searchAllUsers = async (searchValue, offset, searchIn, token) => {
  return fetch(
    `http://localhost:3333/api/1.0.0/search?q=${searchValue}&limit=5&offset=${offset}&search_in=${searchIn}`,
    {
      headers: {
        'X-Authorization': token,
      },
    }
  ).then((response) => {
    return response;
  });
};

/** POST MANAGEMENT ENDPOINTS */

// GET/user/{user_id}/post/
export const getPostList = async (userId, token) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/post/`, {
    headers: {
      'X-Authorization': token,
    },
  }).then((response) => {
    return response;
  });
};

// POST/user/{user_id}/post
export const addNewPost = async (user_id, token, text) => {
  return fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': token,
    },
    body: JSON.stringify({
      text,
    }),
  }).then((response) => {
    return response;
  });
};

// GET/user/{user_id}/post/{post_id}
export const viewSinglePost = async (userId, postId, token) => {
  return fetch(
    `http://localhost:3333/api/1.0.0/user/${userId}/post/${postId}`,
    {
      headers: {
        'X-Authorization': token,
      },
    }
  ).then((response) => {
    return response;
  });
};

// DELETE/user/{user_id}/post/{post_id}
export const deletePost = async (userId, post_id, token) => {
  return fetch(
    `http://localhost:3333/api/1.0.0/user/${userId}/post/${post_id}`,
    {
      method: 'DELETE',
      headers: {
        'X-Authorization': token,
      },
    }
  ).then((response) => {
    return response;
  });
};

// PATCH/user/{user_id}/post/{post_id}
export const updateSinglePost = async (userId, postId, token, updatedText) => {
  return fetch(
    `http://localhost:3333/api/1.0.0/user/${userId}/post/${postId}`,
    {
      method: 'PATCH',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedText),
    }
  ).then((response) => {
    return response;
  });
};

// POST/user/{user_id}/post/{post_id}/like
export const likePost = async (friendId, postId, token) => {
  return fetch(
    `http://localhost:3333/api/1.0.0/user/${friendId}/post/${postId}/like`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    }
  ).then((response) => {
    return response;
  });
};

// DELETE/user/{user_id}/post/{post_id}/like
export const removeLikePost = async (friendId, postId, token) => {
  return fetch(
    `http://localhost:3333/api/1.0.0/user/${friendId}/post/${postId}/like`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    }
  ).then((response) => {
    return response;
  });
};
