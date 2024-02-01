import {  Inject, Injectable } from '@nestjs/common';

@Injectable()
export class User {
    public name:string;
    public email:string;
    public uid:string;
}
