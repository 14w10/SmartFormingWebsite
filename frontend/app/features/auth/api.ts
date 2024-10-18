import { apiClient } from 'libs/api';

import { ResetPasswordFields } from './pages/reset-password/validation-schema';

export const loginReq = (user: { email: string; password: string }) =>
  apiClient.post('/sessions', { user });

export const confirmReq = ({ token }: { token: string }) =>
  apiClient.post('/signups/confirmations', { signup: { token } });

export const forgotPasswordReq = (user: { email: string }) =>
  apiClient.post('/passwords', { user });

export const resetPasswordReq = (user: ResetPasswordFields & { resetPasswordToken: string }) =>
  apiClient.put('/passwords', { user });

export const signUpReq = ({ signup, step }: { signup: any; step: number }) =>
  apiClient.post(`/signups${step === 1 ? '/step_validations' : ''}`, { signup });

export const logout = () => apiClient.delete('/sessions');
