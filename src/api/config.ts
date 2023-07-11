import Api, { Links } from "api"

export type GetDefaultLanguageResponse = {
  language: string;
}

export const getDefaultLanguageApi = () => {
  return Api.get<BaseApiResponse<GetDefaultLanguageResponse>>(Links.config.getDefaultLanguage)
}
