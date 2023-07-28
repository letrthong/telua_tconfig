import Api, {Links} from 'api';

export type AddDeviceBody = {
  serialNumber: string;
  accountId: string;
  pincode: string;
};

export type CheckDeviceStatusBody = {
  serialNumber: string;
};

export type CheckDeviceStatusResponse = {
  validID?: boolean;
  isOnline?: boolean;
  isRegister?: boolean;
};

export const addDevice = (body: AddDeviceBody) => {
  return Api.post(Links.device.add, body);
};

export const checkDeviceStatus = (body: CheckDeviceStatusBody) => {
  return Api.post<CheckDeviceStatusResponse>(Links.device.checkStatus, body);
};
