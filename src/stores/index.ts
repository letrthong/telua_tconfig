import {produce} from 'immer';
import {useEffect, useState} from 'react';
import {MMKVLoader} from 'react-native-mmkv-storage';
import {defaultSetting, maxScanTime} from 'utils';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {StateStorage} from 'zustand/middleware';

const storage = new MMKVLoader()
  .withInstanceID('rNt97sZu8bs')
  .withEncryption()
  .initialize();

const nonePersistedKeys: (keyof StoreState)[] = ['routeState'];

const initialStoreState: StoreState = {
  routeState: 'SPLASH',
  language: undefined,
  setting: defaultSetting,
  isFirstTimeInApp: true,
  lastScanTimeList: [],
};

const useStore = create<StoreState>()(
  persist(_ => initialStoreState, {
    name: 'tconfigs',
    version: 3,
    storage: createJSONStorage(() => storage as unknown as StateStorage),
    partialize: state =>
      Object.fromEntries(
        Object.entries(state).filter(
          ([key]) => !nonePersistedKeys.includes(key as keyof StoreState),
        ),
      ),
  }),
);

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated);

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));
    const unsubFinishHydration = useStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);
  return hydrated;
};

export const setRouteState = (route: TRouteStates) => {
  useStore.setState({routeState: route});
};

export const setLanguage = (language: TLanguage) => {
  useStore.setState({language});
};

export const setSetting = (setting: TSetting) => {
  useStore.setState({setting});
};

export const resetSetting = () => {
  useStore.setState({setting: defaultSetting});
};

export const setIsFirstTimeInApp = (isFirstTimeInApp: boolean) => {
  useStore.setState({isFirstTimeInApp});
};

export const addLastScanTime = () => {
  useStore.setState(
    produce((draft: StoreState) => {
      const time = new Date().toISOString();
      if (draft.lastScanTimeList.length < maxScanTime) {
        draft.lastScanTimeList.push(time);
      } else {
        draft.lastScanTimeList.shift();
        draft.lastScanTimeList.push(time);
      }
    }),
  );
};

export default useStore;
