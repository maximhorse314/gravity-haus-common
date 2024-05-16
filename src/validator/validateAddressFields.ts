import validateStreetAddress from './validateStreetAddress';
import validateRequired from './validateRequired';
import validateZipCode from './validateZipCode';
import removeUndefinedKeysFromObject from './removeUndefinedKeysFromObject';

export const validateAddressFields = (values: any): any => {
  const errors: any = {};
  errors.address1 = validateRequired(values.address1);
  errors.city = validateRequired(values.city);
  errors.state = validateRequired(values.state);
  errors.postalCode = validateZipCode(values.postalCode);

  return removeUndefinedKeysFromObject(errors);
};

export default validateAddressFields;
