const validateEmail = (email: string): string | undefined => {
  if (email.length === 0) {
    return 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return 'Invalid email address';
  }
};

export default validateEmail;
