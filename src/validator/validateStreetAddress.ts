const validateStreetAddress = (value: string): string | undefined => {
  const valid = /^\d+\s[A-z]+\s[A-z]+/.test(value);
  if (!valid) {
    return 'Invalid Address Format';
  }
};

export default validateStreetAddress;
