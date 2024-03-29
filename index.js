import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import App from './src/routes';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed from React Native',
]);

AppRegistry.registerComponent(appName, () => App);
