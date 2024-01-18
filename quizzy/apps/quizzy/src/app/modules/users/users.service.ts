import {  Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';

@Injectable()
export class UsersService {
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createUser(newUser: string): Promise<void> {
        this.fa.firestore.collection('utilisateurs').add({ uid: '1' , username: newUser['username']}).then(r => console.log(r));
        
    }
    async getUser(): Promise<any> {
        var data = await this.fa.firestore.collection('utilisateurs').doc("ZDGSLVjgxjY6dqx1mZ2e").get();
        // console.log("GET DATA: ", data);
        var username = data['_fieldsProto']['username']['stringValue'];
        // console.log("GET USERNAME: ", username);
        return {username: username};

    }

    // constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {
    //     console.log(fa);
    //     this.fa.firestore.collection('test').add({ test: 'test' }).then(r => console.log(r));
    // }
}
