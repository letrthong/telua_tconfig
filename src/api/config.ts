import Api, {Links} from 'api';
import {setLanguage} from 'stores';

export type GetDefaultLanguageResponse = {
  language: TLanguage;
};

export const fetchLanguageApi = async () => {
  const response = await Api.get<GetDefaultLanguageResponse>(
    Links.config.getDefaultLanguage,
  );
  console.log(response.data);
  if (response.ok && response.data?.language) {
    setLanguage(response.data.language);
  }
};
