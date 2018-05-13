function initializeRender() {
  signIn();
  
  /* Register all database callbacks; faceDatabase defined in database.js*/
  var myFirebaseRef = new Firebase(faceDatabase);
  myFirebaseRef.on("value", updateParameters);
  myFirebaseRef.on("value", mouthChangeReceived);
  myFirebaseRef.on("value", eyesChangeReceived);

  loadVoice();
}
