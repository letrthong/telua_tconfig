import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Setting from 'assets/svgs/setting.svg';
import Language from 'assets/svgs/language.svg';
import Item from './Item';
import {useTranslation} from 'react-i18next';
import {RootStackScreenProps} from 'typings/navigation';
import ChangeLanguagePopup from 'components/features/language/change-language-popup';

export default function SettingListScreen({
  navigation,
}: RootStackScreenProps<'SettingList'>) {
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();

  const onPressConfig = () => navigation.navigate('SettingConfig');

  return (
    <ScrollView contentContainerStyle={{paddingBottom: bottom}}>
      <Item
        Icon={Setting}
        onPress={onPressConfig}
        title={t('setting.menu.config')}
      />
      <ChangeLanguagePopup
        SelectButton={
          <Item Icon={Language} title={t('setting.menu.language')} />
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
