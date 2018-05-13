// Check this out for more mouth shapes:
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

function smileMouth() {
  isInverted = false;
  isExtended = true;
  drawMouth();
}

function neutralMouth() {
  isInverted = false;
  isExtended = false;
  drawMouth();
}

function sadMouth() {
  isInverted = true;
  isExtended = true;
  drawMouth();
}

function mouthChangeReceived(snapshot) {
  console.log("mouthChangeReceived")
  var database = snapshot.val();
  var newValue = database["state"]["mouth"];
  if (newValue == "smile")
    smileMouth();
  else if (newValue == "sad")
    sadMouth();
  else
    neutralMouth();
  drawFace();
}

function drawMouth() {

  var svg = document.getElementById("faceSVG");
  var svgHeight = svg.clientHeight;
  var svgWidth = svg.clientWidth;

  /* Draw the rectangle first */
  // var rect = document.createElementNS(svgNS, "rect");
  // rect.setAttribute("x", (50-p.mouthWPercent/2) + "%");
  // rect.setAttribute("y", p.mouthYPercent + "%");
  // rect.setAttribute("width", p.mouthWPercent + "%");
  // rect.setAttribute("height", p.mouthH);
  // rect.setAttribute("rx", 10);
  // rect.setAttribute("ry", 10);
  // rect.setAttribute("fill", p.mouthColor);  
  
  var path = document.getElementById("mouth");
  var mouthExists = (path != null);
  if (!mouthExists) {
    path = document.createElementNS(svgNS, "path");
  }

  var mouthX = svgWidth * 0.5;
  var mouthY = svgHeight * p.mouthYPercent / 100.0;
  var mouthHeight = p.mouthH;
  var mouthTop = mouthY-mouthHeight/2;
  var mouthWidth = svgWidth * p.mouthWPercent/100.0;
  
  var updatedMouthHeight = mouthHeight;
  var updatedMouthWidth = mouthWidth;
  if (isExtended) {
    updatedMouthHeight += 20;
    updatedMouthWidth += 10;
  }
  if (isInverted)
    updatedMouthHeight = -updatedMouthHeight;
    
  path.setAttribute("d", "M" + (mouthX - updatedMouthWidth) + " " + mouthTop +
                    " C "+ (mouthX - updatedMouthWidth + p.mouthSlope) + " " + (mouthTop+updatedMouthHeight) +
                    ", " + (mouthX + updatedMouthWidth - p.mouthSlope) + " " + (mouthTop+updatedMouthHeight) + 
                    ", " + (mouthX + updatedMouthWidth) + " " + mouthTop);

    
  path.setAttribute("stroke-width", p.mouthStrokeWidth);
  path.setAttribute("stroke", p.mouthColor);
  path.setAttribute("fill", "transparent");
  path.setAttribute("id", "mouth");
  
  if (!mouthExists)
    svg.appendChild(path);

}