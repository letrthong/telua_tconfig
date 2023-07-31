import Api, {Links} from 'api';

export type AddDeviceBody = {
  serialNumber: string;
  accountId: string;
  pincode: string;
};

export type AddDeviceResponse = {
  /** 1: success */
  returnCode: number;
  returnCodeName: string;
};

export type CheckDeviceStatusBody = {
  serialNumber: string;
};

export type CheckDeviceStatusResponse = {
  validId?: boolean;
  isOnline?: boolean;
  isRegister?: boolean;
};

export const addDevice = (body: AddDeviceBody) => {
  return Api.post<AddDeviceResponse>(Links.device.add, body);
};

export const checkDeviceStatus = (body: CheckDeviceStatusBody) => {
  return Api.post<CheckDeviceStatusResponse>(Links.device.checkStatus, body);
};
