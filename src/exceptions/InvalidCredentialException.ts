import HttpException from './httpexception';

class InvalidCredentialExecption extends HttpException {
  constructor() {
    super(401, 'Invalid email or password');
  }
}

export default InvalidCredentialExecption;
