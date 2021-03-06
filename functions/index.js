const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// http request 1

// exports.randomNumber = functions.https.onRequest((req, res) => {
//   const number = Math.round(Math.random() * 100);
//   res.send(number.toString());
// });

// // http request 2
// exports.toTheDojo = functions.https.onRequest((request, response) => {
//   response.redirect('https://www.thenetninja.co.uk');
// });

// auth trigger (new user signup)

exports.newUserSignup = functions.auth.user().onCreate((user) => {
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({ email: user.email, upvotedOn: [] });
});

// on user delete

exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});

// http callable function (adding request)

exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated can add requests'
    );
  }

  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'request must be no more than 30 characters long'
    );
  }
  return admin
    .firestore()
    .collection('requests')
    .add({ text: data.text, upvotes: 0 });
});
