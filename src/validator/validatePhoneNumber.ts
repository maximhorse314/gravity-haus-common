import { phone } from 'phone';

const validatePhoneNumber = (phoneNumber: string, countryCode = 'us'): string | undefined => {
  const validate = phone(phoneNumber, { country: countryCode });

  if (!validate.isValid) {
    return 'Invalid Phone Number';
  }
};

export default validatePhoneNumber;
