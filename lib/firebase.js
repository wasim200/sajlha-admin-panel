import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let firebaseInitError = null;

if (!getApps().length) {
  try {
    const envVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!envVar) {
      firebaseInitError = 'متغير البيئة FIREBASE_SERVICE_ACCOUNT غير موجود في Vercel.';
    } else {
      const serviceAccount = JSON.parse(envVar);
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error', error);
    firebaseInitError = 'فشل قراءة مفتاح فايربيس (JSON غير صحيح): ' + error.message;
  }
}

export { firebaseInitError, getMessaging };
