/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import { Feed } from '../pages/Feed';
import { New } from '../pages/New';

const {Navigator, Screen} = createNativeStackNavigator();

import logo from '../assets/logo.png';

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerTintColor: '#000',
        presentation: 'modal',
        headerTitle: () => <Image style={{marginHorizontal: 20}} source={logo} />,
      }}
    >
      <Screen
        name="Feed"
        component={Feed}
      />
      <Screen
        name="New"
        component={New}
      />
    </Navigator>
  );
}
