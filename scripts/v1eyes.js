function drawV1Eyes() {
  if (blinkTimeoutHandle !== null) {
    window.clearTimeout(blinkTimeoutHandle);
  }
  if (lookTimeoutHandle !== null) {
    window.clearTimeout(lookTimeoutHandle);
  }

  drawV1Eye(50 - p.eyeCenterDistPercent, "Left");
  drawV1Eye(50 + p.eyeCenterDistPercent, "Right");

  if (p.isLookingAround) {
    startLookAround();
  }
  else {
    stopLookAround();
    lookAt(currentLookAt);
  }

  var nextBlink = Math.random() * p.avgBlinkTime;
  blinkTimeoutHandle = window.setTimeout(blink, nextBlink);
}

function startBlink(name) {
  var anim = document.getElementById(name);
  if (anim != undefined) 
    anim.beginElement();
}

function blink() {
  startBlink("closeEyeLeft");
  startBlink("closeEyeRight");
  startBlink("closeEyeOuterLeft");
  startBlink("closeEyeOuterRight");
  startBlink("closeEyeInnerLeft");
  startBlink("closeEyeInnerRight");
  startBlink("closeEyePupilRight");
  startBlink("closeEyePupilLeft");
  startBlink("closeEyeReflectionRight");
  startBlink("closeEyeReflectionLeft");
  var nextBlink = Math.random() * p.avgBlinkTime;
  if (blinkTimeoutHandle != null)
    window.clearTimeout(blinkTimeoutHandle);
  blinkTimeoutHandle = window.setTimeout(blink, nextBlink);
}

function getOuterRadiusPercent() {
  return Math.min(p.eyeOuterRadiusPercent, p.eyeOuterRadiusPercent*p.eyeShapeRatio);
}

function getOuterRadius() {
  var svg = document.getElementById("faceSVG");
  var svgWidth = svg.clientWidth;
  return Math.round(svgWidth * getOuterRadiusPercent() / 100.0);
}

function getInnerRadiusPercent() {
  return Math.round(p.eyeInnerRadiusPercent * getOuterRadiusPercent() * 0.01);
}

function getPupilRadiusPercent() {
  return Math.round(p.eyePupilRadiusPercent * getInnerRadiusPercent() * 0.01);
}

function eyesChangeReceived(snapshot) {
  var database = snapshot.val();
  var newValue = database["state"]["eyes"];
  if (newValue == "random") {
    p.isLookingAround = true;
    startLookAround();
  }
  else {
    stopLookAround();
    lookAt(newValue);
  }
  drawFace();
}


var lookAngles = {"right": 0, "left": Math.PI, "down": 0.5*Math.PI, "up":1.5*Math.PI};

function lookAt(where) {
  currentLookAt = where;
  if (where == "none") {
    setEyeOffset(0,0);
  }
  else {
    var offsetRadius = 0.9*(getOuterRadiusPercent() - getInnerRadiusPercent());
    var nextAngle = lookAngles[where];
    var xOffset = Math.round(offsetRadius * Math.cos(nextAngle));
    var yOffset = Math.round(offsetRadius * Math.sin(nextAngle));
    setEyeOffset(xOffset, yOffset);
  }
}

function lookAround() {
  var nextXOffset = 0;
  var nextYOffset = 0;

  if (Math.random() < 0.5) {
    var nextOffsetRadius =
      Math.random() * (getOuterRadiusPercent() - getInnerRadiusPercent());
    var nextAngle = Math.random() * Math.PI * 2;
    nextXOffset = Math.round(nextOffsetRadius * Math.sin(nextAngle));
    nextYOffset = Math.round(nextOffsetRadius * Math.cos(nextAngle));
  }
  setEyeOffset(nextXOffset, nextYOffset);
  if (p.isLookingAround) {
    startLookAround();
  }
}

function startLookAround() {
  var nextLookaround = p.minLookaroundTime + Math.random() * p.avgLookaroundTime;
  lookTimeoutHandle = window.setTimeout(lookAround, nextLookaround);
}

function stopLookAround() {
  p.isLookingAround = false;
  window.clearTimeout(lookTimeoutHandle);
  //TODO: Let the database know
}

function setEyeOffset(xOffset, yOffset) {
  var reflectionOffset = getPupilRadiusPercent() - 3;

  setEyeCircleOffset("InnerRight", xOffset, yOffset, false);
  setEyeCircleOffset("InnerLeft", xOffset, yOffset, true);
  setEyeCircleOffset("PupilRight", xOffset, yOffset, false);
  setEyeCircleOffset("PupilLeft", xOffset, yOffset, true);
  setEyeCircleOffset("ReflectionRight", xOffset+reflectionOffset, yOffset-reflectionOffset, false);
  setEyeCircleOffset("ReflectionLeft", xOffset+reflectionOffset, yOffset-reflectionOffset, true);
}

function setEyeCircleOffset(circleName, xOffset, yOffset, isLeft) {
  var circle = document.getElementById(circleName);
  if (circle != undefined) {
    if (isLeft)
      circle.setAttribute("cx", 50 - p.eyeCenterDistPercent + xOffset + "%");
    else 
      circle.setAttribute("cx", 50 + p.eyeCenterDistPercent + xOffset + "%");
    circle.setAttribute("cy", p.eyeYPercent + yOffset + "%");
  }
}

function drawV1Eye(eyeXPercent, name) {
  // Draw the eye outline circle
  drawEyeCircleWithRadius(
    eyeXPercent,
    p.eyeYPercent,
    getOuterRadius() + p.eyeOutlineThickness,
    p.eyeShapeRatio,
    p.eyeOutlineColor,
    name,
    true,
    false
  );

  if (p.hasEyeLines)
    drawEyeLines(
      eyeXPercent,
      p.eyeYPercent,
      p.eyeOuterRadiusPercent,
      p.backgroundColor,
      p.eyeLineStrokeWidth
    );

  // Draw the outer circle
  drawEyeCircle(
    eyeXPercent,
    p.eyeYPercent,
    p.eyeOuterRadiusPercent,
    p.eyeShapeRatio,
    p.eyeOuterColor,
    "Outer" + name,
    true,
    true
  );
  
   // Draw the inner circle
  drawEyeCircle(
    eyeXPercent,
    p.eyeYPercent,
    Math.round(getInnerRadiusPercent()),
    1.0,
    p.eyeInnerColor,
    "Inner" + name,
    true,
    false
  );

   // Draw the pupil
  if (p.hasPupil)
    drawEyeCircle(
      eyeXPercent,
      p.eyeYPercent,
      getPupilRadiusPercent(),
      1.0,
      p.eyePupilColor,
      "Pupil" + name,
      true,
      true
    );

  var reflectionOffset = getPupilRadiusPercent() - 3;
  if (p.hasReflection)
    drawEyeCircle(
      eyeXPercent + reflectionOffset,
      p.eyeYPercent - reflectionOffset,
      1,
      1.0,
      "#ccc",
      "Reflection" + name,
      true,
      true
    );
}

function drawEyeCircle(
  xPercent,
  yPercent,
  radiusPercent,
  eyeShapeRatio,
  color,
  name,
  isBlinking,
  isLooking
) {
  var svg = document.getElementById("faceSVG");
  var svgWidth = svg.clientWidth;
  var radius = Math.round(svgWidth * radiusPercent / 100.0);
  drawEyeCircleWithRadius(
    xPercent,
    yPercent,
    radius,
    eyeShapeRatio,
    color,
    name,
    isBlinking,
    isLooking
  );
}

function drawEyeCircleWithRadius(
  xPercent,
  yPercent,
  radius,
  eyeShapeRatio,
  color,
  name,
  isBlinking,
  isLooking
) {
  var svg = document.getElementById("faceSVG");
  var circle = document.createElementNS(svgNS, "ellipse");
  var svgHeight = svg.clientHeight;
  var svgWidth = svg.clientWidth;

  circle.setAttribute("id", name);
  circle.setAttribute("cx", xPercent + "%");
  circle.setAttribute("cy", yPercent + "%");
  circle.setAttribute("rx", radius);
  circle.setAttribute("ry", Math.round(radius*eyeShapeRatio));
  circle.setAttribute("fill", color);

  if (isBlinking) {
    var blinkClose = document.createElementNS(svgNS, "animate");
    blinkClose.setAttribute("id", "closeEye" + name);
    blinkClose.setAttribute("attributeName", "ry");
    blinkClose.setAttribute("from", Math.round(radius*eyeShapeRatio));
    blinkClose.setAttribute("to", "0");
    blinkClose.setAttribute("dur", "0.05s");
    circle.appendChild(blinkClose);

    var blinkOpen = document.createElementNS(svgNS, "animate");
    blinkOpen.setAttribute("id", "openEye" + name);
    blinkOpen.setAttribute("attributeName", "ry");
    blinkOpen.setAttribute("from", "0");
    blinkOpen.setAttribute("to", Math.round(radius*eyeShapeRatio));
    blinkOpen.setAttribute("dur", "0.1s");
    blinkOpen.setAttribute("begin", "closeEye" + name + ".end");
    circle.appendChild(blinkOpen);
  }
  svg.appendChild(circle);
}

function drawEyeLines(xPercent, yPercent, radiusPercent, color, strokeWidth) {
  var svg = document.getElementById("faceSVG");
  var svgHeight = svg.clientHeight;
  var svgWidth = svg.clientWidth;
  var radius = Math.round(svgWidth * radiusPercent / 100.0);
  var x = Math.round(svgWidth * xPercent / 100.0);
  var y = Math.round(svgHeight * yPercent / 100.0);
  drawLine(x - radius, y - radius, x + radius, y + radius, color, strokeWidth);
  drawLine(x - radius, y, x + radius, y, color, strokeWidth);
  drawLine(x + radius, y - radius, x - radius, y + radius, color, strokeWidth);
  drawLine(x, y - radius, x, y + radius, color, strokeWidth);
}

function drawLine(x1, y1, x2, y2, color, strokeWidth) {
  var svg = document.getElementById("faceSVG");
  var line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.style.stroke = color;
  line.style.strokeWidth = strokeWidth;
  svg.appendChild(line);
}
