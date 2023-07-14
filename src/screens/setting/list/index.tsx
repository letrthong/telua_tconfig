import Language from 'assets/svgs/language.svg';
import Setting from 'assets/svgs/setting.svg';
import ChangeLanguagePopup from 'components/features/language/change-language-popup';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Item from './Item';
import type {RootStackScreenProps} from 'typings/navigation';

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
        title={t('setting.menu.config')}
        onPress={onPressConfig}
      />
      <ChangeLanguagePopup
        SelectButton={
          <Item Icon={Language} title={t('setting.menu.language')} />
        }
      />
    </ScrollView>
  );
}
