function initializeControl() {
  signIn();
  
  /* Register all database callbacks */
  var myFirebaseRef = new Firebase(faceDatabase);
  myFirebaseRef.on("value", updateParameters);
  myFirebaseRef.on("value", mouthChangeReceived);
  myFirebaseRef.on("value", eyesChangeReceived);
 
  loadVoice();

  /* Set up control interface */
  var expressionSelect = document.getElementById('expressionSelect');
  expressionSelect.addEventListener("change", expressionChanged);
  // var eyeSelect = document.getElementById('eyesSelect');
  // eyeSelect.addEventListener("change", eyesChanged);
  // var mouthSelect = document.getElementById('mouthSelect');
  // mouthSelect.addEventListener("change", mouthChanged);
  var speakButton = document.getElementById('speak');
  speakButton.addEventListener("click", speakSentence);

  var lang = 'en-US';
  var voiceSelect = document.getElementById('voice');

    // Loop through each of the voices.
//     voices.forEach(function(voice, i) {
//       if (voice.lang == lang)
//       {
//         // Create a new option element.
//         var option = document.createElement('option');

//         // Set the options value and text.
//         option.value = voice.name;
//         option.innerHTML = voice.name;

//         // Add the option to the voice selector.
//         voiceSelect.appendChild(option);
//       }
//     });
//     voiceSelect.addEventListener("change", changeVoice);
  
  /* Set up Firebase: faceDatabase defined in database.js*/
  
}

function sayPreset(target) {
  sendSpeech(target.value);
}

function speakSentence(e) {
  var speakText = document.getElementById('speakText');
  var text = speakText.value;
  sendSpeech(text);
  
  var newButtonsDiv = document.getElementById('userAdded');
  newButtonsDiv.innerHTML += "<input type='button' class='newButton' onclick='sayPreset(this)' value='" + text.replace("'", "") + "'>";
}

function sendSpeech(text) {
  var dbRef = firebase.database().ref('/state/');
  var updates = {"say": text};
  dbRef.update(updates); 
}

var expressions = {
  "happy": {"eyes": "none", "mouth": "smile"},
  "neutral": {"eyes": "none", "mouth": "flat"},
  "sad": {"eyes": "down", "mouth": "sad"},
};

function expressionChanged() {
  var expressionSelect = document.getElementById('expressionSelect');
  var dbRef = firebase.database().ref('/state/');
  var updates = expressions[expressionSelect.value];
  dbRef.update(updates);
}

function mouthChanged() {
  var mouthSelect = document.getElementById('mouthSelect');
  var dbRef = firebase.database().ref('/state/');
  var updates = {"mouth": mouthSelect.value};
  dbRef.update(updates);
}

function eyesChanged() {
  var eyeSelect = document.getElementById('eyesSelect');
  var dbRef = firebase.database().ref('/state/');
  var updates = {"eyes": eyeSelect.value};
  dbRef.update(updates);
}
