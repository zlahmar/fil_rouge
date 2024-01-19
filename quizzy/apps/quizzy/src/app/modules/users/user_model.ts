import {  Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
@Injectable()
export class User {
    public name:string;
    public email:string;
    public password:string;
    public uid:string;
}
