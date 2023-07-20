import {useAppState} from '@react-native-community/hooks';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ThemeProvider} from '@rneui/themed';
import Api from 'api';
import {fetchLanguageApi} from 'api/config';
import 'locales';
import LoadingModal from 'components/atoms/loading-modal';
import i18n from 'locales';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import CodePush from 'react-native-code-push';
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
import type {
  DownloadProgress,
  UpdateDialog as RNCodepushUpdateDialog,
} from 'react-native-code-push';
import type {MainTabParamList, RootStackParamList} from 'typings/navigation';

const codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};

const RootStack = createStackNavigator<RootStackParamList & MainTabParamList>();
const onReady = () => BootSplash.hide({fade: true});

const App = () => {
  const hydrated = useHydration();
  const {t} = useTranslation();
  const {routeState, language} = useStore();
  const appState = useAppState();
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const updateDialog: RNCodepushUpdateDialog = {
    title: t('codepush.title') || '',
    optionalUpdateMessage: t('codepush.optional_update_message') || '',
    optionalIgnoreButtonLabel: t('button.skip') || '',
    optionalInstallButtonLabel: t('button.update') || '',
  };

  useEffect(() => {
    fetchLanguageApi();
  }, []);

  useEffect(() => {
    if (appState === 'active') {
      CodePush.sync(
        {
          installMode: CodePush.InstallMode.IMMEDIATE,
          updateDialog,
        },
        _status => {},
        p => {
          if (p) {
            setProgress(p);
          }
        },
      );
    }
  }, [appState]);

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
        <LoadingModal
          isVisible={!!progress}
          progress={progress}
          text={t('codepush.updating') || ''}
        />
        <FlashMessage
          position="top"
          statusBarHeight={StatusBar.currentHeight}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default CodePush(codePushOptions)(App);
