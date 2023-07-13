type TRouteStates = 'SPLASH' | 'MAIN';

type TSetting = {
  ssid: string;
  password: string;
  url_portal: string;
};

type StoreState = {
  routeState: TRouteStates;
  language: TLanguage;
  setting: TSetting;
};

type TPageParams = Partial<{
  per_page: number;
  page: number;
}>;

type TPageResponse<T> = {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
};

type BaseApiResponse<T = void, K = void> = {
  data: T;
  message?: string;
} & (
  | {success: true}
  | {success: false; error_code: number; errors?: Record<keyof K, string[]>}
);

// vietnam, english
type TLanguage = 'vi' | 'en';

type TUser = {
  id: number;
  username: string;
  name: string;
  avatar: string | null;
  created_at: string;
  token: string;
  phone_number?: string | null;
};

type TMediaType = 'image' | 'video';

type TMedia = {
  id: number | string;
  type: TMediaType;
  url: string;
  file_name?: string;
  created_at?: string;
  mime?: string;
  localUri?: string;
  isTakePhoto?: boolean;
};

type TFileUpload = {
  uri: string;
  type: string;
  name?: string;
};

type TFirebaseAuthPhoneError = Error & {
  code:
    | 'auth/invalid-phone-number'
    | 'auth/missing-phone-number'
    | 'auth/quota-exceeded'
    | 'auth/user-disabled'
    | 'auth/operation-not-allowed';
};

type TModifyList = 'replace' | 'unshift' | 'push';

type TSelectPopup = {
  id: number | string;
  title: string;
  selected?: boolean;
  onPress?: (id: number | string) => void;
};

type TPopover = {
  id?: number | string;
  selected?: boolean;
  title: string;
  onPress: (id?: number | string) => void;
};
