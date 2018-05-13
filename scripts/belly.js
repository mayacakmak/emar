var slider = document.getElementById("myRange");
var output = document.getElementById("output");
var text = document.getElementById("question");
output.innerHTML = slider.value;

// Get a reference to the database service
 // var database = firebase.database();

function writeUserData(val) {
  database.ref('answer/').set({
    answer: val
  });
}

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
} 

document.getElementById("submit").onclick = function(writeUserData) { 
  if (slider.value <= 20) {
  text.innerHTML = "No stress, that's great to hear!"}
  else if (slider.value <= 40) {
  text.innerHTML = "Glad to hear that."}
  else if (slider.value <= 80) {
  text.innerHTML = "I'm feeling about the same."}
  else {
  text.innerHTML = "Oh no, I'm sorry to hear that."};
  //callback(slider.value);
}
