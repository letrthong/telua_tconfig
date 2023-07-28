import {Text} from '@rneui/themed';
import Scan from 'assets/svgs/scan.svg';
import Search from 'assets/svgs/search.svg';
import Setting from 'assets/svgs/setting.svg';
import SignIn from 'assets/svgs/sign-in.svg';
import LoadingModal from 'components/atoms/loading-modal';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import useStore from 'stores';
import {Gap, IconSizes} from 'utils';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';
import type {FC} from 'react';
import type {SvgProps} from 'react-native-svg';
import type {MainTabScreenProps} from 'typings/navigation';

type ItemProps = {
  Icon: FC<SvgProps>;
  title: string;
  onPress: () => void;
};

const signInUrl = 'https://telua.co/aiot';

const Item = ({Icon, title, onPress}: ItemProps) => {
  return (
    <TouchableOpacity
      style={[AppStyles.flex1, AppStyles.itemCenter, {marginBottom: Gap * 2}]}
      onPress={onPress}>
      <Icon
        color={Colors.primary}
        height={IconSizes.veryLarge}
        style={AppStyles.marginBottomSmall}
        width={IconSizes.veryLarge}
      />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({navigation}: MainTabScreenProps<'Home'>) {
  const {t} = useTranslation();
  const [loading] = useState(false);
  const {setting} = useStore();

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = () => {
    if (!setting.prefix || !setting.password || !setting.url_portal) {
      Alert.alert(t('util.info'), t('home.enter_config'));
      navigation.navigate('SettingConfig');
      return false;
    }
    return true;
  };

  const onPressScan = async () => {};

  const onPressSetting = () => navigation.navigate('SettingList');

  const onPressScanQR = () => navigation.navigate('ScanQR');

  const onPressSignIn = () => Linking.openURL(signInUrl);

  return (
    <View style={[AppStyles.flex1, AppStyles.padding]}>
      <View style={AppStyles.row}>
        <Item Icon={Search} title={t('home.menu.scan')} onPress={onPressScan} />
        <Item
          Icon={Setting}
          title={t('home.menu.setting')}
          onPress={onPressSetting}
        />
      </View>
      <View style={AppStyles.row}>
        <Item
          Icon={Scan}
          title={t('home.menu.scan_qr')}
          onPress={onPressScanQR}
        />
        <Item
          Icon={SignIn}
          title={t('home.menu.sign_in')}
          onPress={onPressSignIn}
        />
      </View>
      <LoadingModal isVisible={loading} />
    </View>
  );
}
