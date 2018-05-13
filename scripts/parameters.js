var currentFace = 1;
var currentConfig = 0;
var currentLookAt = "none";
var isInverted = false;
var isExtended = false;

var p = {
  eyeOutlineThickness: 2,
  eyeShapeRatio: 2.0,
  isLookingAround: true,
  hasReflection: true,
  hasInnerPupil: false,
  backgroundColor:"#E3B265",
  eyeCenterDistPercent:25,
  eyeYPercent:50,
  isLEDEyes:0,
  /* V1 style eyes*/
  eyeOuterRadiusPercent:15,
  eyeInnerRadiusPercent:5,
  eyeOuterColor:"#FFD",
  eyeInnerColor:"#000",
  backgroundColor:"#000",
  hasEyeLines:1,
  eyeLineStrokeWidth:10,
  hasPupil:1,
  eyePupilRadius: 10,
  eyePupilRadiusPercent: 2,
  eyePupilColor: "#AAAAAA",
  pupilXOffset: 1,
  pupilYOffset: 1,
  /* V2 style eyes*/
  eyeWPercent:30,
  eyeHPercent:50,
  betweenCircleDistancePercent:15,
  eyeBackgroundColor:"#222",
  eyeLEDOffColor:"#444",
  eyeLEDOnColor:"#86CCEE",
  nCircles:9,
  text:"Hello, my name is EMAR",
  avgBlinkTime: 9000,
  avgLookaroundTime: 4000,
  minLookaroundTime: 2000,
  /* Mouth */
  hasMouth: 1,
  mouthWPercent: 10,
  mouthYPercent: 80,
  mouthH: 25,
  mouthR: 5,
  mouthColor: "#222222",
  mouthStrokeWidth: 10,
  mouthSlope: 20,
  
}

var newParameters;
/* Other globals */
var svgNS = "http://www.w3.org/2000/svg";
var blinkTimeoutHandle = null;
var lookTimeoutHandle = null;

/* Callback function for when the parameter database is updated*/
function updateParameters(snapshot) {
  var database = snapshot.val();
  newParameters = database.configs[database.currentConfig];
  
  for (var i=0; i<Object.keys(newParameters).length; i++)
  {
    var key = Object.keys(newParameters)[i];
    var param = newParameters[key];
    if (param.type == "number" || param.type == "boolean") {
      p[key] = Number(newParameters[key].current);
    }
    else {
      p[key] = String(newParameters[key].current);
    }
  }
  drawFace();
}