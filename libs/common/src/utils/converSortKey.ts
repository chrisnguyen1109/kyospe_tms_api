import { OrderBy } from '../types/common.type';

export const convertKeySortUser = (
  sort: Record<string, OrderBy>,
): Record<string, OrderBy> => {
  const sortConverted: any = {};

  const keyMap = new Map([
    ['mUserId', 'mUser.mUserId'],
    ['userId', 'mUser.userId'],
    ['userNm', 'mUser.userNm'],
    ['userNmKn', 'mUser.userNmKn'],
    ['mailAddress', 'mUser.mailAddress'],
    ['roleDivNm', 'roleDivNm'],
    ['mainBaseNm', 'mainBaseNm'],
    ['transportCompanyNm', 'transportCompany.transportCompanyNm'],
  ]);

  for (const key of Object.keys(sort)) {
    const convertedKey = keyMap.get(key);
    if (convertedKey) {
      sortConverted[convertedKey] = sort[key];
    }
  }
  return sortConverted;
};
