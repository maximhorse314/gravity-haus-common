import validateRequired from './validateRequired';
import validateEmail from './validateEmail';
import validatePassword from './validatePassword';
import validatePhoneNumber from './validatePhoneNumber';
import validate18YearsOfAge from './validate18YearsOfAge';
import removeUndefinedKeysFromObject from './removeUndefinedKeysFromObject';

const validateAccountFields = (values: any): any => {
  const errors: any = {};
  const dob = validateRequired(values.dateOfBirth) != null || validate18YearsOfAge(values.dateOfBirth);

  errors.firstName = validateRequired(values.firstName);
  errors.lastName = validateRequired(values.lastName);
  errors.email = validateEmail(values.email);
  errors.phoneNumber = validatePhoneNumber(values.phoneNumber);
  errors.dateOfBirth = dob;
  errors.password = validatePassword(values.password);

  return removeUndefinedKeysFromObject(errors);
};

export default validateAccountFields;
