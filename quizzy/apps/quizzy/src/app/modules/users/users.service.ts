import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FirebaseAdmin, FirebaseConstants } from 'nestjs-firebase';

@Injectable()
export class UsersService {
    constructor(@Inject(FirebaseConstants.FIREBASE_TOKEN) private readonly fa: FirebaseAdmin) {}

    async createUser(newUser, uidUser:string, emailUser:string): Promise<void> {
        if (!newUser || !newUser.username) {
            throw new Error('Username is required.');
        }
        await this.fa.firestore.doc('utilisateurs/'+uidUser).set({
            username: newUser.username,
            email: emailUser
        })
    }
    async getUser(uidUser:string): Promise<any> {
        try {
            const documentData = await this.fa.firestore.collection('utilisateurs').doc(uidUser).get();
            if (!documentData.exists){
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            }
            const dataUser = documentData.data();

            return {username: dataUser['username'], uid: dataUser['uid'], email: dataUser['email']};
        } catch (error) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        

    }
}
