import type {AssetType} from '@react-native-camera-roll/camera-roll';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  SettingList: undefined;
  SettingConfig: undefined;
};

type MainTabParamList = {
  Home: undefined;
};

type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    StackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
