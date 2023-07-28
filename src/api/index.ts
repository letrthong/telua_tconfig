import {create} from 'apisauce';
import type {Method} from 'axios';

const baseURL = 'https://telua.co/services/';
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
  },
  device: {
    add: 'bot/v1/production/management/esp32/device/add',
    checkStatus: 'bot/v1/production/management/esp32/device/status',
  },
};

export const showAlertLinks: {method: Method; url: string | undefined}[] = [];
export const noSignOutLinks: {method: string; url: string | undefined}[] = [];

export default Api;
