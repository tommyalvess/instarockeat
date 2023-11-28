/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './routes';

export function Routes() {
  return (
    <NavigationContainer >
      <AppRoutes />
    </NavigationContainer>
  );
}
