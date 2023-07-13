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

const defaultUrlPortal = 'http://192.168.0.1';

const initialStoreState: StoreState = {
  routeState: 'SPLASH',
  language: undefined,
  setting: {
    prefix: '',
    password: '',
    url_portal: defaultUrlPortal,
  },
};

const useStore = create<StoreState>()(
  persist(_ => initialStoreState, {
    name: 'tconfigs',
    version: 1,
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

export default useStore;
