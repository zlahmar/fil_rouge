import {  Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
@Injectable()
export class User {
    public username:string;
    public email:string;
    public uid:string;
}
