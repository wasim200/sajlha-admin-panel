import * as admin from 'firebase-admin';

let firebaseInitError = null;

if (!admin.apps?.length) {
  try {
    // حاول قراءة المفتاح من متغيرات البيئة
    const envVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!envVar) {
      firebaseInitError = 'متغير البيئة FIREBASE_SERVICE_ACCOUNT غير موجود في Vercel.';
    } else {
      const serviceAccount = JSON.parse(envVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('Firebase Admin SDK initialization error', error);
    firebaseInitError = 'فشل قراءة مفتاح فايربيس (JSON غير صحيح): ' + error.message;
  }
}

export { firebaseInitError };
export default admin;
