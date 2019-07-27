import HttpException from './httpexception';

class InvalidAuthenticationException extends HttpException {
  constructor() {
    super(401, 'Invalid authentication info');
  }
}

export default InvalidAuthenticationException;
