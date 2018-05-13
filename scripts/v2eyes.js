function drawV2Eyes() {
  var circleImage = drawCanvasCircle();
  var binaryCircle = binarizeImage(circleImage);
  var eyePattern = downsampleImage(binaryCircle, p.nCircles, p.nCircles);
  
  /* Left eye */
  drawV2Eye(50 - p.eyeCenterDistPercent, eyePattern);

  /* Right eye */
  drawV2Eye(50 + p.eyeCenterDistPercent, eyePattern);
}

function drawCanvasCircle() {
  var canvas = document.getElementById("eyeCanvas");
  var context = canvas.getContext("2d");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = 28;
  context.scale(1, 1);
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "black";
  context.fill();
  context.lineWidth = 30;
  context.strokeStyle = "white";
  context.stroke();
  var dataObj = context.getImageData(0, 0, canvas.width, canvas.height);
  var data = dataObj.data;
  return data;
}

function binarizeImage(data) {
  var canvas = document.getElementById("eyeCanvas");
  var binaryImage = [];
  for (var i = 0; i < canvas.height; i++) {
    var row = [];
    for (var j = 0; j < canvas.width; j++) {
      var isWhite = 0;
      if (
        data[4 * (i * 100 + j)] == 255 &&
        data[4 * (i * 100 + j) + 1] == 255 &&
        data[4 * (i * 100 + j) + 2] == 255
      ) {
        isWhite = 1;
      }
      row.push(isWhite);
    }
    binaryImage.push(row);
  }
  return binaryImage;
}

function downsampleImage(imageArr, width, height) {
  var currH = imageArr.length;
  var currW = imageArr[0].length;

  var blockSizeH = Math.floor(currH / height);
  var blockSizeW = Math.floor(currW / width);

  var smallImgArr = [];
  for (var i = 0; i < height; i++) {
    var row = [];
    for (var j = 0; j < width; j++) {
      var nOn = 0;
      for (var k = 0; k < blockSizeH; k++) {
        for (var l = 0; l < blockSizeW; l++) {
          nOn += imageArr[i * blockSizeH + k][j * blockSizeW + l];
        }
      }
      var isOn = 0;
      if (nOn > blockSizeH * blockSizeW / 2) isOn = 1;
      row.push(isOn);
    }
    smallImgArr.push(row);
  }
  return smallImgArr;
}

function drawV2Eye(xPercent, eyePattern) {
  var svg = document.getElementById("faceSVG");
  var rect = document.createElementNS(svgNS, "rect");
  var svgHeight = svg.clientHeight;
  var svgWidth = svg.clientWidth;
  var width = svgWidth * p.eyeWPercent / 100.0;
  var height = svgHeight * p.eyeHPercent / 100.0;
  /* Keep the eyes square*/
  if (height > width) {
    width = height;
  }
  var leftX = Math.round(svgWidth * xPercent / 100.0) - width / 2;
  var topY = Math.round(svgHeight * p.eyeYPercent / 100.0) - width / 2;

  /* Draw the rectangle first */
  rect.setAttribute("x", leftX);
  rect.setAttribute("y", topY);
  rect.setAttribute("width", width);
  rect.setAttribute("height", width);
  rect.setAttribute("fill", p.eyeBackgroundColor);
  svg.appendChild(rect);

  /* Then draw the circles */
  var increment = Math.floor(width / p.nCircles);
  var radius = Math.round(
    (1.0 - p.betweenCircleDistancePercent / 100.0) * increment / 2
  );
  var leftOver = width - increment * p.nCircles;

  for (var i = 0; i < p.nCircles; i++) {
    for (var j = 0; j < p.nCircles; j++) {
      var color = p.eyeLEDOffColor;
      if (eyePattern[j][i] == 1) color = p.eyeLEDOnColor;
      drawSmallCircle(
        leftX + leftOver / 2 + increment / 2 + i * increment,
        topY + leftOver / 2 + increment / 2 + j * increment,
        radius,
        color
      );
    }
  }
}

function drawSmallCircle(x, y, radius, color) {
  var svg = document.getElementById("faceSVG");
  var circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.style.fill = color;
  svg.appendChild(circle);
}
