import {createNavigationContainerRef} from '@react-navigation/native';
import type {MainTabParamList} from 'typings/navigation';
import type {RootStackParamList} from 'typings/navigation';

export const navigationRef = createNavigationContainerRef();

export const navigate = (
  name: keyof RootStackParamList | keyof MainTabParamList,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
) => {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
};

export const replace = (
  name: keyof RootStackParamList | keyof MainTabParamList,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any,
) => {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
};

export const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};
