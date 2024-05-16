const validateRequired = (value: string): string | undefined => {
  if (value.length === 0) {
    return 'Required';
  }
};

export default validateRequired;
