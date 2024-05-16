export const removeUndefinedKeysFromObject = (obj: any): any => {
  const copy = { ...obj };

  Object.keys(copy).forEach((key) => {
    if (copy[key] === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete copy[key];
    }
  });

  return copy;
};

export default removeUndefinedKeysFromObject;
