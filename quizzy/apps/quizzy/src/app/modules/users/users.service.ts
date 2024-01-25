import {  Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
import { User } from './user_model';
@Injectable()
export class UsersService {
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createUser(newUser, idToken:string): Promise<void> {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        const emailUser = decodedToken.email;
        this.fa.firestore.doc('utilisateurs/'+uidUser).set({
            username: newUser["username"],
            email: emailUser,
        })
    }
    async getUser(idToken:string): Promise<any> {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        
        var querySnapshot = await this.fa.firestore.collection('utilisateurs').doc(uidUser).get();
        if (!querySnapshot.exists){
            return null;
        }
        var dataUser = querySnapshot.data();

        return {username: dataUser['username'], email: "", uid: dataUser['uid']};

    }
}
