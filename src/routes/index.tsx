import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeProvider} from '@rneui/themed';
import Api, {noSignOutLinks, showAlertLinks} from 'api';
import type {ApiResponse} from 'apisauce';
import 'locales';
import i18n from 'locales';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'screens/splash';
import useStore, {useHydration} from 'stores';
import type {MainTabParamList, RootStackParamList} from 'typings/navigation';
import {Colors, light, navigationTheme} from 'utils/themes';
import MainTab from './MainTab';
import {navigationRef} from './RootNavigation';

const RootStack = createStackNavigator<RootStackParamList & MainTabParamList>();
const onReady = () => BootSplash.hide({fade: true});

const App = () => {
  const hydrated = useHydration();
  const {routeState, language} = useStore();
  const {t} = useTranslation();

  useEffect(() => {
    Api.addResponseTransform(
      (response: ApiResponse<BaseApiResponse | undefined>) => {
        if (
          response.problem === 'CONNECTION_ERROR' ||
          response.problem === 'NETWORK_ERROR'
        ) {
          response.data = {
            ...response.data,
            message: t('alert.error.network'),
          } as BaseApiResponse;
          return;
        }
        if (
          (response.ok && response.data?.success !== true) ||
          (!response.ok && response.data?.success !== false)
        ) {
          response.ok = false;
          response.data = {
            data: undefined,
            success: false,
            message:
              typeof response.data?.message === 'string' &&
              response.data.message
                ? response.data.message
                : t('alert.error.default') || '',
            error_code: 5000,
          };
        } else if (
          !response.ok &&
          response.data?.success === false &&
          (typeof response.data?.message !== 'string' || !response.data.message)
        ) {
          response.data.message = t('alert.error.default') || '';
        }
      },
    );

    Api.addMonitor((response: ApiResponse<BaseApiResponse>) => {
      if (response.ok) {
        return;
      }
      if (
        response.problem === 'CLIENT_ERROR' &&
        response.status === 401 &&
        !noSignOutLinks.some(
          link =>
            link.method === response.config?.method &&
            link.url === response.config?.url,
        )
      ) {
        showMessage({
          type: 'danger',
          message: t('alert.error.unauthorized'),
        });
        return;
      }
      if (
        !showAlertLinks.some(
          link =>
            link.method === response.config?.method &&
            link.url === response.config?.url,
        )
      ) {
        return;
      }
      switch (response.problem) {
        case 'CONNECTION_ERROR':
        case 'NETWORK_ERROR':
          showMessage({
            type: 'danger',
            message: t('alert.error.network'),
          });
          break;
        case 'CANCEL_ERROR':
          break;
        default:
          showMessage({
            type: 'danger',
            message: response.data?.message || '',
          });
          break;
      }
    });
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
    Api.setHeader('Accept-Language', language);
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
