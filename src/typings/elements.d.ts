import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors {
    transparent: string;
    info: string;
    border: string;
    placeholder: string;
    icon: string;
    primaryLight: string;
  }

  export interface ComponentTheme {
    Text: Partial<TextProps>;
  }

  export interface ButtonProps {
    noFullWidth?: boolean;
  }
}
