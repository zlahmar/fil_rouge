import {  Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';

@Injectable()
export class UsersService {
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createUser(newUser): Promise<void> {
        console.log("NEW USER: ",newUser);
        //il nous manque l'uid
        this.fa.firestore.collection('utilisateurs').add({ uid: '6' , username: newUser['username']}).then(r => console.log(r));
    }
    async getUser(): Promise<any> {
        var querySnapshot = await this.fa.firestore.collection('utilisateurs').where('uid', '==', "4").get();
        if (querySnapshot.empty) {
            console.log('GET_USER: No matching documents.');
            return null;
        }
        var dataUser = querySnapshot.docs[0].data();
        console.log("GET_DATA_USER: ", dataUser);

        return {username: dataUser['username'], email: "", uid: dataUser['uid']};

    }
}
