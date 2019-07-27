import { IsString } from "class-validator";

class LoginDataDto {
    @IsString()
    public email!: string;

    @IsString()
    public password!: string;
}


export default LoginDataDto;