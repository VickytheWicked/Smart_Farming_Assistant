// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen2 from './HomeScreen2';  
import imageScreen from './ImageUp2';
import LocationAccess2 from './location2';

export type RootStackParamList = {
  // Home: undefined;
  // Text: undefined;
  Home: undefined;   //change
  Image: undefined;
  // location: undefined;
  location: undefined;
  Market_Price: undefined;
  
  // Add more screens here as your app grows
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            {/* <Stack.Screen name="Home" component={HomeScreen} />  */}
            <Stack.Screen name="Home" component={HomeScreen2} />  
            {/* <Stack.Screen name="Text" component={TextScreen} /> */}
            <Stack.Screen name="Image" component={imageScreen}/>
            {/* <Stack.Screen name="location" component={LocationAccess} /> */}
            <Stack.Screen name="location" component={LocationAccess2}/>
            <Stack.Screen name="location" component={LocationAccess2}/>
          </Stack.Navigator>
        </NavigationContainer>
    );
};
export default AppNavigator;