import {useEffect, useState} from 'react';
import {MMKVLoader} from 'react-native-mmkv-storage';
import {create} from 'zustand';
import type {StateStorage} from 'zustand/middleware';
import {createJSONStorage, persist} from 'zustand/middleware';

const storage = new MMKVLoader()
  .withInstanceID('rNt97sZu8bs')
  .withEncryption()
  .initialize();

const nonePersistedKeys: (keyof StoreState)[] = ['routeState'];

const initialStoreState: StoreState = {
  routeState: 'SPLASH',
  language: 'vi',
};

const useStore = create<StoreState>()(
  persist(_ => initialStoreState, {
    name: 'records',
    version: 0,
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

export default useStore;
