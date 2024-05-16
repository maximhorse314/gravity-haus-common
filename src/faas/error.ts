// class FaasError extends Error {
//   // statusCode: number;
//   // error: string;

//   constructor(message: string, statusCode: number, error: any) {
//     // super();
//     super(message);
//     // this.name = 'FaasError';
//     // this.statusCode = statusCode;
//     // this.error = error;
//   }
// }

/**
 * throws an error that the fass api can return
 *
 * @param {String} statusCode - statusCode of the error
 *
 *  @param {Object} error - The error to pass in this is an object that is given to the response body
 *
 * @returns {Object} throws object with statusCode and body
 *
 */
export default (statusCode: number, error: any) => {
  // throw new FaasError(message, statusCode, error);
  throw {
    statusCode: `${statusCode}`,
    body: JSON.stringify({ error }),
  };
};
