import { IfMBaseType, IfSlipType } from '@batch/if/if.type';

export const imagePattern = /^image\/(bmp|heic|jpeg|jpg|png|tiff)$/;

export const ifMBaseFilePattern = (ifMBaseType: IfMBaseType) =>
  new RegExp(
    `tms_ｍ_${ifMBaseType}_([0-9]{4})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9]).csv$`,
  );

export const ifSLipFilePattern = (ifSlipType: IfSlipType) =>
  new RegExp(
    `(head|detail|deadline)_tms_${ifSlipType}_([0-9]{4})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9]).csv$`,
  );
