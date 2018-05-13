var isAnonymous = false;

// Initialize Firebase
var config1 = {
    apiKey: "AIzaSyBZveTmVgPoOD6vNTu_L1kg-7zNPO3t27g",
    authDomain: "emar-face.firebaseapp.com",
    databaseURL: "https://emar-face.firebaseio.com",
    projectId: "emar-face",
    storageBucket: "emar-face.appspot.com",
    messagingSenderId: "613612121756"
};

var config2 = {
    apiKey: "AIzaSyCEt6rbcxVKn2pRmnK8-xPhMwfd4nxtUAI",
    authDomain: "emar-face2.firebaseapp.com",
    databaseURL: "https://emar-face2.firebaseio.com",
    projectId: "emar-face2",
    storageBucket: "emar-face2.appspot.com",
    messagingSenderId: "596151016771"
};

var config3 = {
    apiKey: "AIzaSyBbltiJJ7Ogm0M-RczDwILOnY8HzIBexg0",
    authDomain: "emar-face3.firebaseapp.com",
    databaseURL: "https://emar-face3.firebaseio.com",
    projectId: "emar-face3",
    storageBucket: "",
    messagingSenderId: "1067130115551"
};

///////////////////////////
var config = config1;
var faceDatabase= config1["databaseURL"];
var currentFace = 1;
var app;
///////////////////////////

function signIn() {
  
  var url = window.location.toString();
  var parameterName = "robot";
  console.log("url:" + url);
  var urlParamIndex = url.indexOf(parameterName+"=")
  if (urlParamIndex != -1) {
    var valueIndex = urlParamIndex + parameterName.length + 1;
    console.log("valueIndex:" + valueIndex);
    console.log("url:" + url.length);
    var robot = url.substring(valueIndex);
    console.log("Robot:" + robot);
    currentFace = Number(robot);
  }
  
  if (currentFace == 1) {
    faceDatabase= config1["databaseURL"];  
    config = config1;
  }
  if (currentFace == 2) {
    faceDatabase= config2["databaseURL"];  
    config = config2;
  }
  if (currentFace == 3) {
    faceDatabase= config3["databaseURL"];  
    config = config3;
  }
  
  app = firebase.initializeApp(config);

  firebase
    .auth()
    .signInAnonymously()
    .catch(handleError);
  firebase.auth().onAuthStateChanged(handleAuthStateChange);
}

function handleError(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log("Error " + errorCode + ": " + errorMessage);
}

function handleAuthStateChange(user) {
  if (user) {
    // User is signed in.
    isAnonymous = user.isAnonymous;
    uid = user.uid;
    console.log("Signed in.");
    
  } else {
    console.log("User is signed out.");
  }
}
