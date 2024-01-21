import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

        // Vérifiez si le username est définie
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
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const emailUser = decodedToken.email;
            console.log("Decoded_token_UID_LOGIN: ", emailUser);
            
            const querySnapshot = await this.fa.firestore.collection('utilisateurs').where('uid', '==', String(decodedToken.uid)).get();
            
            if (querySnapshot.empty) {
                console.log('GET_USER_PROFILE: No matching documents.');
                throw new Error('User not found');
            }
    
            const dataUser = querySnapshot.docs[0].data();
            console.log("GET_DATA_USER: ", dataUser);
    
            return {
                username: String(dataUser['username']),
                email: dataUser['email'],
                uid: String(dataUser['uid']),
            };
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }
}