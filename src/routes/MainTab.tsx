import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {ReactNode} from 'react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {MainTabParamList} from 'typings/navigation';
import {DefaultIconProps, Gap} from 'utils';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';
import {styles} from './styles';
import {Text} from '@rneui/themed';
import HomeScreen from 'screens/home';
import Home from 'assets/svgs/home.svg';

type TabBarIconProps = {
  focused: boolean;
};

const _styles = StyleSheet.create({
  tabBarIconContainer: {
    borderRadius: 20,
    height: 32,
    maxWidth: '100%',
    width: 64,
  },
});

const Tabs = createBottomTabNavigator<MainTabParamList>();

const TabBarIconContainer = ({
  children,
}: TabBarIconProps & {children: ReactNode}) => (
  <View style={[AppStyles.center, _styles.tabBarIconContainer]}>
    {children}
  </View>
);

const HomeIcon = (props: TabBarIconProps) => (
  <TabBarIconContainer {...props}>
    <Home {...DefaultIconProps} color={Colors.primary} />
  </TabBarIconContainer>
);

const tabBarLabel = ({
  focused,
  children,
}: {
  focused: boolean;
  children: string;
}) => (
  <Text
    numberOfLines={1}
    style={[
      AppStyles.textSmall,
      AppStyles.textRegular,
      AppStyles.textGrey3,
      {marginBottom: Gap / 4},
      focused && [AppStyles.textPrimary],
    ]}>
    {children}
  </Text>
);

const MainTab = () => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();

  return (
    <Tabs.Navigator
      backBehavior="initialRoute"
      screenOptions={{
        tabBarStyle: {
          height: 50 + bottom,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabel,
        tabBarHideOnKeyboard: Platform.OS === 'android',
      }}>
      <Tabs.Screen
        component={HomeScreen}
        name="Home"
        options={{
          tabBarIcon: HomeIcon,
          title: t('tab_title.home') || '',
        }}
      />
    </Tabs.Navigator>
  );
};

export default MainTab;
