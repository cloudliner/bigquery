import * as functions from 'firebase-functions';

export const helloWorld = functions.https.onRequest((request, response) => {
  const userAgent = request.headers['user-agent'];
  console.log(`userAgent: ${userAgent}`);
  response.send("Hello from Firebase!");
});
