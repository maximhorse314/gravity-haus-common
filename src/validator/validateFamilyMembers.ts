import removeUndefinedKeysFromObject from './removeUndefinedKeysFromObject';
import validateEmail from './validateEmail';
import validatePhoneNumber from './validatePhoneNumber';
import validateRequired from './validateRequired';

export const validateFamilyMembers = (familyMembers: any[]): any[] | undefined => {
  const errors: any[] = [];

  familyMembers.forEach((member: any, i: number) => {
    const error = removeUndefinedKeysFromObject({
      firstName: validateRequired(member.firstName),
      lastName: validateRequired(member.lastName),
      dateOfBirth: validateRequired(member.dateOfBirth),
      phoneNumber: validatePhoneNumber(member.phoneNumber, member.countryCode),
      email: validateEmail(member.email),
    });

    errors.push(error);
  });

  const memberErrors = errors.map((element) => Object.keys(element).length !== 0);

  return memberErrors.includes(true) ? errors : undefined;
};

export default validateFamilyMembers;
