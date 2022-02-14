import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@auth_token");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAuthToken = async () => {
  await AsyncStorage.removeItem("@auth_token");
};
