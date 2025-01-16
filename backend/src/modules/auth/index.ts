export * from './auth.controller';
export * from './auth.service';
export * from './auth.methods';
export * from './auth.socket';
export * from './auth.types';

import { login, register, getStatus } from './auth.methods';
import { handleMessage } from './auth.socket';
import { AuthController } from './auth.controller';

export const methods = {
  login,
  register,
  getStatus,
};

export const ws = {
  handleMessage,
};

export const http = {
  controller: AuthController,
};
