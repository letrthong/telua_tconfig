import i18n from 'locales';
import {Platform} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import themes, {Colors} from './themes';
import type {SvgProps} from 'react-native-svg';

export const Fonts = themes.Fonts;
export const IconSizes = themes.IconSizes;
export const FontSizes = themes.FontSizes;
export const BorderRadiuses = themes.BorderRadiuses;
export const ButtonHeight = themes.ButtonHeight;
export const ButtonHeights = themes.ButtonHeights;
export const ButtonNoFullWidth = themes.ButtonNoFullWidth;
export const Gap = themes.Gap;
export const GapSmall = themes.GapSmall;
export const MinPasswordLength = 6;

export const Ratio = {
  banner: 2,
  horizontalItem: 1.42,
  itemFull: 1.27,
  video: 1.78,
  message: 1.67,
};

export const DateFormats = {
  client: {
    full: 'HH:mm DD/MM/YYYY',
    short: 'DD/MM/YYYY',
  },
  server: {
    full: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    short: 'YYYY-MM-DD',
  },
};

export const IconTypes = {
  antDesign: 'antdesign',
  entypo: 'entypo',
  evilIcons: 'evilicons',
  feather: 'feather',
  fontAwesome: 'font-awesome',
  fontAwesome5: 'font-awesome-5',
  fontIsto: 'fontisto',
  foundation: 'foundation',
  ionIcons: 'ionicon',
  material: 'material',
  materialCommunity: 'material-community',
  octIcons: 'octicon',
  simpleLineIcons: 'simple-line-icon',
  zocial: 'zocial',
};

export const DefaultIconProps: SvgProps = {
  color: Colors.icon,
  width: IconSizes.medium,
  height: IconSizes.medium,
};

export const DefaultGetAllPageParams: TPageParams = {
  /** Get all */
  per_page: 0,
};

export const DefaultPageParams: TPageParams = {
  per_page: 10,
};

export const FormDataHeaders = {
  'Content-Type': 'multipart/form-data',
};

export const defaultSetting: TSetting = {
  prefix: 'Telua',
  password: '12345678',
  url_portal: 'http://192.168.0.1',
};

export const goToUrlPortalDelay = 3000;

export const getItemWidth = (cols = 1) => {
  return (responsiveScreenWidth(100) - Gap * (cols + 1)) / cols;
};

export const getInputPlacehoder = (title: string) => {
  return `${i18n.t('input.placeholder.input')} ${title.toLowerCase()}`;
};

export const getSelectPlacehoder = (title: string) => {
  return `${i18n.t('input.placeholder.select')} ${title.toLowerCase()}`;
};

export const getInputError = (title: string, trim?: boolean) => {
  return `${i18n.t('error.required.input')} ${(trim
    ? title?.trim()
    : title
  ).toLowerCase()}`;
};

export const getSelectError = (title: string, trim?: boolean) => {
  return `${i18n.t('error.required.select')} ${(trim
    ? title?.trim()
    : title
  ).toLowerCase()}`;
};

/*
 * @param {number} time - minutes
 * @return {string} 5h30m
 * */
export const formatTime = (time: number, hasUnit = true) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  if (hasUnit) {
    return hours ? `${hours}h${minutes}m` : `${minutes}m`;
  }
  return hours ? `${hours}:${minutes}` : `${minutes}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const compareShallow = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\\=|\\<|\\>|\?|\/|,|\.|\\:|\\;|\\'|\\"|\\&|\\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
};

export const isIncludeString = (str: string, subStr: string) => {
  return removeVietnameseTones(str.trim().toLowerCase()).includes(
    removeVietnameseTones(subStr.trim().toLowerCase()),
  );
};

export const updateList = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldData: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newData: any[],
  type: TModifyList,
  key = 'id',
) => {
  let _oldData = [...oldData];
  if (type === 'replace') {
    _oldData = newData;
  } else {
    (type === 'push' ? newData : newData.reverse()).forEach(item => {
      // @ts-ignore
      const index = _oldData.findIndex(d => d[key] === item[key]);
      if (index !== -1) {
        if (!compareShallow(_oldData[index], item)) {
          _oldData[index] = item;
        }
      } else {
        if (type === 'push') {
          _oldData.push(item);
        } else {
          _oldData.unshift(item);
        }
      }
    });
  }
  return _oldData;
};

export const waitModal = (func: () => void) => {
  if (Platform.OS === 'ios') {
    setTimeout(() => {
      func();
    }, 700);
  } else {
    func();
  }
};
