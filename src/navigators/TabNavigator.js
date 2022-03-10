import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyFriends from '../components/03_FriendMgmt/MyFriends';
import { deleteAuthToken, getAuthToken } from '../utils/AsyncStorage';
import ProfileStack from '../components/04_ProfileMgmt/ProfileStack';
import Login from '../components/01_LoginSignUp/Login';
import SearchUsers from '../components/03_FriendMgmt/SearchUsers';

const Tab = createBottomTabNavigator();

class BottomTabNavigator extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    // const authToken = await getAuthToken();
    const authToken = await getAuthToken();
    if (authToken == null) {
      this.props.navigation.navigate('Login');
    }
  };

  logoutUser = async () => {
    const authToken = await getAuthToken();
    return fetch('http://localhost:3333/api/1.0.0/logout/', {
      method: 'POST',
      headers: {
        'X-Authorization': authToken,
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Logout successful');
          await deleteAuthToken();
          this.props.navigation.navigate('Login');
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch((error) => {
        console.log(`Logout unsuccessful: ${error}`);
      });
  };

  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarInactiveBackgroundColor: '#9c20c6',
          tabBarActiveBackgroundColor: '#7c105b',
          tabBarInactiveTintColor: 'white',
          tabBarActiveTintColor: 'white',
          tabBarStyle: { height: 58 },
          tabBarLabelStyle: {
            fontSize: 11,
            paddingBottom: 5,
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={32} />
            ),
          }}
        />
        <Tab.Screen
          name="Friends"
          component={MyFriends}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="account-multiple"
                color={color}
                size={32}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchUsers}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={32} />
            ),
          }}
        />
        <Tab.Screen
          name="Logout"
          component={Login}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="export" color={color} size={32} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              this.logoutUser();
              // console.log('Logout tab pressed');
            },
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default BottomTabNavigator;
