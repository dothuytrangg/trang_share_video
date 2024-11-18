import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, response } from "express";

@Injectable()
export class AdminAuth implements CanActivate{
    constructor(private jwtService:JwtService,private configService:ConfigService){}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret:this.configService.get<string>('SECRET')
            })
            console.log('Payload:', payload); 
            if(payload.role != 3){
                return false;
            }
            request['user_data'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request:Request):string|undefined{
        const[type,token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];

        return type === 'Bearer' ? token : undefined;
    }
}