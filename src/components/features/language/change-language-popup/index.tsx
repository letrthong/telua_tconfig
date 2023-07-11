import SelectPopup from 'components/mulecules/select/select-popup';
import React from 'react';
import {useTranslation} from 'react-i18next';
import useStore, {setLanguage} from 'stores';
import type {ComponentProps} from 'react';

type Props = Omit<ComponentProps<typeof SelectPopup>, 'data'>;

export default function ChangeLanguagePopup(props: Props) {
  const {t} = useTranslation();
  const {language} = useStore();
  const data: (TSelectPopup & {id: TLanguage})[] = [
    {id: 'en', title: t('language.set.en')},
    {id: 'vi', title: t('language.set.vi')},
  ];

  const onSelect = (id: TLanguage) => {
    setLanguage(id);
  };

  return (
    <SelectPopup
      {...props}
      data={data}
      selectedId={language}
      onSelect={value => onSelect(value as TLanguage)}
    />
  );
}
