const validateZipCode = (zipCode: string): string | undefined => {
  if (zipCode.length === 0) {
    return 'Required';
  } else if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/i.test(zipCode)) {
    return 'Invalid Zip Code';
  }
};

export default validateZipCode;
