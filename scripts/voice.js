var grammar = '#JSGF V1.0; grammar emar; public <greeting> = hello | hi; <person> = maya | alisa;'
var recognition = new window.webkitSpeechRecognition();
var speechRecognitionList = new window.webkitSpeechGrammarList();
var voices;
var selectedVoice;

function loadVoice(isCreateSelector) {
  //speechRecognitionList.addFromString(grammar, 1);
  //recognition.grammars = speechRecognitionList;
  //recognition.continuous = true;
  //recognition.lang = 'en-US';
  //recognition.interimResults = false;
  //recognition.maxAlternatives = 1;
  // document.body.onclick = function() {
  //   recognition.start();
  //   console.log('Ready to receive a color command.');
  // }

  myFirebaseRef = new Firebase(faceDatabase);
  myFirebaseRef.on("value", sayAndDeleteSpeechCommand);
  
  // Execute loadVoices.
  loadVoiceOptions(isCreateSelector);

  // Chrome loads voices asynchronously.
  window.speechSynthesis.onvoiceschanged = function(e) {
    loadVoiceOptions(isCreateSelector);
  };
}

// Fetch the list of voices and populate the voice options.
function loadVoiceOptions(isCreateSelector) {
  // Fetch the available voices.
	voices = speechSynthesis.getVoices();
}

function changeVoice() {
  console.log("changing voice");
  var voiceSelect = document.getElementById('voice');
  selectedVoice = voices.filter(
    function(voice) {
      return voice.name == voiceSelect.value; 
    })[0];
}

// function restart() {
//   recognition.start
// }
// recognition.onresult = function(event) {
//   var inputSpeech = event.results[0][0].transcript;
//   console.log('Result received: ' + inputSpeech);
//   say(inputSpeech);
//   //window.setTimeout(restart, 1000);
// }

var lastSentence = "";
function sayAndDeleteSpeechCommand(snapshot) {
  console.log(">>>>>>>>>   sayAndDeleteSpeechCommand called");
  var database = snapshot.val();
  var sentence = database["state"]["say"];
  console.log("sentence: " + sentence);
  if (sentence != "") // && lastSentence != sentence
    say(sentence);
  lastSentence = sentence;
  var dbRef = firebase.database().ref('/state/');
  var updates = {"say": ""};
  dbRef.update(updates);
}

function say(text) {
  console.log("called say");
  var lang = 'en-US';
    /*Check that your browser supports test to speech*/
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      //console.log("Your browser supports " + voices.length + " voices");
      //console.log(voices);
      msg.voice = voices.filter(function(voice) { return voice.lang == lang; })[0];
    }
    msg.voice = selectedVoice;
    // msg.voiceURI = 'native';
    // msg.volume = 0.8; // 0 to 1
    // msg.rate = 0.9; // 0.1 to 10
    // msg.pitch = 0.9; //0 to 2
    // msg.lang = lang;
    msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' milliseconds.');
    };
   msg.text = text;
   console.log("SPEAKING NOW-----" + msg.text);
    speechSynthesis.speak(msg);
  }
}

// function speak(e) {
//   // Get the text input element.
//   var speechMsgInput = document.getElementById('speech-msg');
//   if (speechMsgInput.value.length > 0) {
//     say(speechMsgInput.value);
//   }
// }
