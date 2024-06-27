export const getAddress = (
  address1: string | null,
  address2: string | null,
  address3: string | null,
) => {
  return (address1 ?? '') + (address2 ?? '') + (address3 ?? '');
};
