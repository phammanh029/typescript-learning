import HttpException from "./httpexception";

class NotAuthorizeException extends HttpException{
    constructor(){
        super(403, 'You are not have permission on this');
    }
}

export default NotAuthorizeException;