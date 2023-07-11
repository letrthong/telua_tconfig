declare module '*.png' {
  const value: number;
  export = value;
}

declare module '*.jpg' {
  const value: number;
  export = value;
}

declare module '*.json';

declare module '*.svg' {
  import type React from 'react';
  import type {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
