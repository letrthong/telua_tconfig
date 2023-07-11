import {create} from 'apisauce';
import type {Method} from 'axios';

const baseURL = 'https://telua.co/services/v1/';
const Api = create({baseURL, timeout: 15000});

export const setApiToken = (token?: string | null) => {
  if (token) {
    Api.setHeader('Authorization', 'Bearer ' + token);
  } else {
    Api.deleteHeader('Authorization');
  }
};

export const Links = {
  config: {
    getDefaultLanguage: 'v1/community/environment/getDefaultLanguage',
  }
};

export const showAlertLinks: {method: Method; url: string | undefined}[] = [
];
export const noSignOutLinks: {method: string; url: string | undefined}[] = [
];

export default Api;
