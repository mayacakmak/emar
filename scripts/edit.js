function initializeEdit() {
  signIn();

  var myFirebaseRef = new Firebase(faceDatabase);
  myFirebaseRef.on("value", createScales);
  
  loadVoice();
}

function createScales(snapshot) {
  updateParameters(snapshot);

  var database = snapshot.val();
  currentConfig = database.currentConfig;
  var params = database.configs[currentConfig];
  
  /* Check if the scales are created already */
  var scaleExample = document.getElementById("eyeCenterDistPercent");
  if (scaleExample == null) {
    var mainDiv = document.getElementById("main");
    
    /* Number type parameters, selected with sliders*/
    for (var i=0; i<Object.keys(params).length; i++)
    {
      var key = Object.keys(params)[i];
      var param = params[key];
      if (param.v2eyes == undefined) {
        if (param.type == "number") {
          var nIncrements = 20;
          if (param.nIncrements != undefined)
            nIncrements = param.nIncrements;
          mainDiv.appendChild(
            createRangeInput(key, param.name, param.current, param.min, param.max, nIncrements));
        }
      }
    }
    
    /* Color parameters */
    for (var i=0; i<Object.keys(params).length; i++)
    {
      var key = Object.keys(params)[i];
      var param = params[key];
      if (param.v2eyes == undefined) {
        if (param.type == "color") {
            createColorInput(key, param.name, param.current);
        }
      }
    }
    
    /* Boolean/binary parameters */
    for (var i=0; i<Object.keys(params).length; i++)
    {
      var key = Object.keys(params)[i];
      var param = params[key];
      if (param.v2eyes == undefined) {
        if (param.type == "boolean") {
           createBooleanInput(key, param.name, param.current, ['a', 'b'])  
        }
      }
    }
    drawFace();
  } 
  else {
    console.log("Scales already exist.");
  }
}

function createBooleanInput(id, name, current, optionNames) {
  var boolPickers = document.getElementsByClassName("boolPicker");
  
  var radio1 = ' Yes <input type="radio" onchange="newParameterValue(this)" ' +
      ' name = ' + id + ' value=1 ';
  var radio2 = ' No <input type="radio" onchange="newParameterValue(this)" ' +
      ' name = ' + id + ' value=0 ';
        
  if (current==1) {
    radio1 += ' checked>';
    radio2 += '>';
  }
  else {
    radio2 += ' checked>';
    radio1 += '>';
  }

  var boolSelectorHTML = '<div class="sliderName"> ' + name + '</div>' +
      '<div>' + radio1 + radio2 + '</div>';
  
  var mainDiv = document.getElementById("main");
  if (boolPickers.length > 0) {
    var boolPicker = boolPickers[0];
    boolPicker.innerHTML += boolSelectorHTML
  }
  else {
    var boolPicker = document.createElement("div");
    boolPicker.className = "boolPicker";
    boolPicker.innerHTML = boolSelectorHTML;
    mainDiv.appendChild(boolPicker);
  }
}

function createColorInput(id, name, current) {
  var colorPickers = document.getElementsByClassName("colorPicker");
  var mainDiv = document.getElementById("main");
  if (colorPickers.length > 0) {
    var colorPicker = colorPickers[0];
    colorPicker.innerHTML += '<div class="sliderName"> ' + name + ':</div>' +
      '<div> <input type="color" onchange="newParameterValue(this)" ' +
      ' name = ' + id +
      ' value="' + current + '"> </div>'
  }
  else {
    var colorPicker = document.createElement("div");
    colorPicker.className = "colorPicker";
    colorPicker.innerHTML = '<div class="sliderName"> ' + name + ':</div>' +
      '<div> <input type="color" onchange="newParameterValue(this)" ' +
      ' name = ' + id +
      ' value="' + current + '"> </div>';
    mainDiv.appendChild(colorPicker);
  }
}

function createRangeInput(id, name, current, min, max, nIncrements) {
  var scale = document.createElement("div");
  scale.className = "scale";
  scale.id = id;
  scale.innerHTML = getRangeHTML(id, name, current, min, max, nIncrements);
  return scale;
}

function getRangeHTML(id, name, current, min, max, nIncrements) {
  return (
    '<div class="sliderName">' + name + ':</div>' +
    '<div class="sliderValue">' + current + '</div>' +
    '<div class="minValue">' + min + '</div>' +
    '<div>' +
    '<input type="range" class="slider" ' + //list="' + name + 'tickmarks" ' +
    ' min=' + min + ' max=' + max + ' step =' + (max-min)/nIncrements +
    ' onchange="newParameterValue(this)" id=' +
    id +
    ' name=' +
    id +
    " value=" +
    current +
    "> </div>" +  //+getDataList(name, min, max, nIncrements)
    '<div class="maxValue">' + max + '</div>'
  );
}

function getDataList(name, min, max, nIncrements) {
  var htmlText = '<datalist id="' + name + 'tickmarks">'
  for (var i=0; i<nIncrements; i++)
  {
    var value = min + i*(max-min);
    if (i==0 || i==nIncrements-1 || i==Math.round(nIncrements/2))
      htmlText += '<option value="' + value + '" label="' + value + '">';
    else
      htmlText += '<option value="' + value + '">';
  }
  htmlText += '</datalist>';
  return htmlText;
}

// Update the database in response to a UI event
function newParameterValue(target) {
  var dbRef = firebase.database().ref('/configs/' + currentConfig + '/');
  var updates = {};
  var key = target.name;
  console.log(key);
  var newParam = newParameters[key];
  if (newParam.type == "number" || newParam.type == "boolean")
    newParam.current = Number(target.value);
  else
    newParam.current = target.value;
  
  var newParamObj = {};
  newParamObj[key] = newParam;

  if (newParam.type == "number") {
    var sliderElement = document.getElementById(key);
    var sliderValueDiv = sliderElement.getElementsByClassName('sliderValue')[0];
    sliderValueDiv.innerHTML = target.value;
  }
  
  dbRef.update(newParamObj);
}
