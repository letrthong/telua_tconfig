import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';

type MMKVType = {};

const MMKV = new MMKVLoader()
  .withInstanceID('9r7s8tZuNbs')
  .withEncryption()
  .initialize();

export const useStorage = <T extends keyof MMKVType>(
  key: T,
  defaultValue?: MMKVType[T],
) => {
  const s = useMMKVStorage<MMKVType[T]>(key, MMKV, defaultValue);
  return s;
};
