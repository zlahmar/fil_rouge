import {  Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
import { User } from './user_model';
@Injectable()
export class UsersService {
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createUser(newUser : User, idToken:string): Promise<void> {
        console.log("NEW USER: ",newUser);
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        console.log("Decoded_token_UID: ", uidUser);
        
        this.fa.firestore.doc('utilisateurs/'+uidUser).set({
            username: newUser.name,
            email:newUser.email,
        })
    }
    async getUser(idToken:string): Promise<any> {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        const emailUser = decodedToken.email;
        console.log("Decoded_token_UID_LOGIN: ", emailUser);

        // var querySnapshot = await this.fa.firestore.collection('utilisateurs').where('uid', '==', String(decodedToken.uid)).get();
        var querySnapshot = await this.fa.firestore.collection('utilisateurs').doc(uidUser).get();
        if (!querySnapshot.exists){
            return null;
        }
        var dataUser = querySnapshot.data();

        return {username: dataUser['username'], email: dataUser['email'], uid: dataUser['uid']};

    }
}
