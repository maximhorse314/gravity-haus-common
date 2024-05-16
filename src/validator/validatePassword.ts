const validatePassword = (value: string): string | undefined => {
  if (value.length === 0) {
    return 'Required';
  } else {
    // const atLeastOneDiget = /\d/
    // if (!atLeastOneDiget.test(value)) {
    //   return 'should contain at least one digit'
    // }

    // const atLeastOneLowerCase = /(.*[a-z].*)$/
    // if (!atLeastOneLowerCase.test(value)) {
    //   return 'should contain at least one lower case'
    // }

    // const atLeastOneUpperCase = /(.*[A-Z].*)$/
    // if (!atLeastOneUpperCase.test(value)) {
    //   return 'should contain at least one upper case'
    // }

    if (value.length <= 7) {
      return 'should contain at least 8 characters';
    }
  }
};

export default validatePassword;
