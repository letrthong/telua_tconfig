import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeProvider} from '@rneui/themed';
import Api from 'api';
import {fetchLanguageApi} from 'api/config';
import 'locales';
import i18n from 'locales';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SettingConfigScreen from 'screens/setting/config';
import SettingListScreen from 'screens/setting/list';
import SplashScreen from 'screens/splash';
import useStore, {useHydration} from 'stores';
import {Colors, light, navigationTheme} from 'utils/themes';
import MainTab from './MainTab';
import {navigationRef} from './RootNavigation';
import type {MainTabParamList, RootStackParamList} from 'typings/navigation';

const RootStack = createStackNavigator<RootStackParamList & MainTabParamList>();
const onReady = () => BootSplash.hide({fade: true});

const App = () => {
  const hydrated = useHydration();
  const {t} = useTranslation();
  const {routeState, language} = useStore();

  useEffect(() => {
    fetchLanguageApi();
  }, []);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      Api.setHeader('Accept-Language', language);
    }
  }, [language]);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={light}>
        <StatusBar
          translucent
          backgroundColor={Colors.transparent}
          barStyle="dark-content"
        />
        <NavigationContainer
          ref={navigationRef}
          theme={navigationTheme}
          onReady={onReady}>
          <RootStack.Navigator initialRouteName="Splash" screenOptions={{}}>
            {!hydrated || routeState === 'SPLASH' ? (
              <RootStack.Group>
                <RootStack.Screen
                  component={SplashScreen}
                  name="Splash"
                  options={{headerShown: false}}
                />
              </RootStack.Group>
            ) : (
              <RootStack.Group>
                <RootStack.Screen
                  component={MainTab}
                  name="Main"
                  options={{
                    headerShown: false,
                  }}
                />
                <RootStack.Screen
                  component={SettingListScreen}
                  name="SettingList"
                  options={{
                    title: t('screen_title.setting_list'),
                  }}
                />
                <RootStack.Screen
                  component={SettingConfigScreen}
                  name="SettingConfig"
                  options={{
                    title: t('screen_title.setting_config'),
                  }}
                />
              </RootStack.Group>
            )}
          </RootStack.Navigator>
        </NavigationContainer>
        <FlashMessage
          position="top"
          statusBarHeight={StatusBar.currentHeight}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
