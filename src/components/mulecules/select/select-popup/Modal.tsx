import {Divider, Text} from '@rneui/themed';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Gap} from 'utils';
import Item from './Item';
import type {ComponentProps} from 'react';
import type {ListRenderItem} from 'react-native';
import MyModal from 'components/atoms/my-modal';

type Props = ComponentProps<typeof MyModal> & {
  data: TSelectPopup[];
  onSelect?: (id: TSelectPopup['id']) => void;
};

const ItemSeparatorComponent = () => (
  <Divider style={{marginHorizontal: Gap}} />
);

export default function Modal({data, onSelect, ...props}: Props) {
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();

  const renderItem: ListRenderItem<TSelectPopup> = ({item}) => {
    const onPress = () => {
      if (item.onPress) {
        item.onPress(item.id);
      } else if (onSelect) {
        onSelect(item.id);
      }
      props.onDismiss && props.onDismiss?.();
    };

    return <Item item={item} onPress={onPress} />;
  };

  return (
    <MyModal {...props}>
      <FlatList
        contentContainerStyle={[{paddingBottom: bottom}]}
        data={data}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text>{t('alert.info.no_data')}</Text>}
        renderItem={renderItem}
      />
    </MyModal>
  );
}
