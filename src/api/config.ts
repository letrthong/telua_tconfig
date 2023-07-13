import Api, {Links} from 'api';
import useStore, {setLanguage} from 'stores';

export type GetDefaultLanguageResponse = {
  language: TLanguage;
};

export const fetchLanguageApi = async () => {
  const response = await Api.get<GetDefaultLanguageResponse>(
    Links.config.getDefaultLanguage,
  );
  if (response.ok && response.data?.language && !useStore.getState().language) {
    setLanguage(response.data.language);
  }
};
