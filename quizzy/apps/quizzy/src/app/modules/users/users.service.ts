import { Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';
import * as admin from 'firebase-admin';
import { User } from './user_model';

@Injectable()
export class UsersService {
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createUser(newUser: User, idToken: string): Promise<void> {
        console.log("NEW USER: ", newUser);
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uidUser = decodedToken.uid;
        console.log("Decoded_token_UID: ", uidUser);

        // Vérifiez si la propriété 'username' est définie
        if (!newUser || !newUser.username) {
            throw new Error('Username is required.');
        }

        const userDocument: { uid: string; username: string; email?: string } = {
            uid: uidUser,
            username: newUser.username,
        };
    
        // Ajouter le email si elle est définie
        if (newUser.email) {
            userDocument.email = newUser.email;
        }
    
        // Associer le uid avec le username dans le document Firestore
        await this.fa.firestore.collection('utilisateurs').doc(uidUser).set(userDocument);
    }

    async getUser(idToken: string): Promise<any> {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const emailUser = decodedToken.email;
        console.log("Decoded_token_UID_LOGIN: ", emailUser);

        var querySnapshot = await this.fa.firestore.collection('utilisateurs').where('uid', '==', String(decodedToken.uid)).get();
        if (querySnapshot.empty) {
            console.log('GET_USER: No matching documents.');
            return null;
        }

        var dataUser = querySnapshot.docs[0].data();
        console.log("GET_DATA_USER: ", dataUser);

        return {
            username: String(dataUser['username']),
            email: dataUser['email'],
            uid: String(dataUser['uid']),
        };
    }
}
