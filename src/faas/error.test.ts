import error from './error';

describe('faas error', () => {
  it.skip('should throw an error', async () => {
    // const newError = new Error('no')
    expect(error(500, 'bad')).toThrow('FaasError');
  });
});
