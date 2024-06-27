export const formatCacheKey = (...args: string[]) => args.join(':');

export const userAuthKey = (userId: number, sessionId: string) =>
  formatCacheKey('user', userId.toString(), 'auth', sessionId);

export const userRfTokenKey = (userId: number, sessionId: string) =>
  formatCacheKey('user', userId.toString(), 'rfToken', sessionId);

export const userPwTokenKey = (email: string) =>
  formatCacheKey('user', email, 'pwToken');
