import React, {useState} from 'react';
import {Keyboard, TouchableOpacity} from 'react-native';
import Modal from './Modal';
import type {ReactNode} from 'react';
import type {ViewProps} from 'react-native';

type Props = {
  data: TSelectPopup[];
  SelectButton: ReactNode;
  selectedId?: TSelectPopup['id'];
  selectButtonStyle?: ViewProps['style'];
  onSelect?: (id: TSelectPopup['id']) => void;
};

export default function SelectPopup({
  data,
  selectedId,
  SelectButton,
  selectButtonStyle,
  onSelect,
}: Props) {
  const [modal, setModal] = useState(false);
  const sortedData = data.map(item => ({
    ...item,
    selected: item.id === selectedId,
  }));

  const showModal = () => {
    Keyboard.dismiss();
    setModal(true);
  };
  const hideModal = () => setModal(false);

  return (
    <>
      <TouchableOpacity style={selectButtonStyle} onPress={showModal}>
        {SelectButton}
      </TouchableOpacity>
      <Modal
        isBottom
        data={sortedData}
        isVisible={modal}
        onDismiss={hideModal}
        onSelect={onSelect}
      />
    </>
  );
}
