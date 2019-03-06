const globalValues = { total: 0, label: "All Airlines" };
const labelArray = [
  "00:59",
  "01:59",
  "02:59",
  "03:59",
  "04:59",
  "05:59",
  "06:59",
  "07:59",
  "08:59",
  "09:59",
  "10:59",
  "11:59",
  "12:59",
  "13:59",
  "14:59",
  "15:59",
  "16:59",
  "17:59",
  "18:59",
  "19:59",
  "20:59",
  "21:59",
  "22:59",
  "23:59"
];

/*** FUNCTION TO FILTER DATA ***/
filterData = option => {
  if (option === "All") {
    this.populateData(airlineData, "All Airlines");
  } else {
    let data = airlineData.filter(airline => {
      if (
        typeof airline === "object" &&
        airline != null &&
        airline.hasOwnProperty("airline")
      ) {
        if (airline.airline === option) return airline;
      }
      return null;
    });

    populateData(data, option);
  }
};

/*** FUNCTION TO POPULATE DATASET ***/
populateData = (data, label) => {
  let total = 0;
  const noOfAirlines = [
    { time: 0, flights: 0 },
    { time: 1, flights: 0 },
    { time: 2, flights: 0 },
    { time: 3, flights: 0 },
    { time: 4, flights: 0 },
    { time: 5, flights: 0 },
    { time: 6, flights: 0 },
    { time: 7, flights: 0 },
    { time: 8, flights: 0 },
    { time: 9, flights: 0 },
    { time: 10, flights: 0 },
    { time: 11, flights: 0 },
    { time: 12, flights: 0 },
    { time: 13, flights: 0 },
    { time: 14, flights: 0 },
    { time: 15, flights: 0 },
    { time: 16, flights: 0 },
    { time: 17, flights: 0 },
    { time: 18, flights: 0 },
    { time: 19, flights: 0 },
    { time: 20, flights: 0 },
    { time: 21, flights: 0 },
    { time: 22, flights: 0 },
    { time: 23, flights: 0 }
  ];

  data.forEach(timeSlot => {
    if (typeof timeSlot === "object" && timeSlot != null) {
      if (
        timeSlot.hasOwnProperty("airline") &&
        timeSlot.hasOwnProperty("time")
      ) {
        let time = timeSlot.time.split(":");
        let timeStamp = +time[0];
        if (typeof timeStamp === "number" && timeStamp >= 0 && timeStamp <= 23)
          noOfAirlines[timeStamp].flights += 1;
      }
    }
  });

  noOfAirlines.forEach(obj => {
    total += obj.flights;
  });
  if (label !== "All Airlines") {
    label = airlines[label];
  }

  globalValues["total"] = total;
  globalValues["label"] = label;

  let header = globalValues.total + " Flights " + globalValues.label;

  let tmp = document.getElementById("h3");
  tmp.textContent = header;

  let maxY = Math.max.apply(
    Math,
    noOfAirlines.map(function(o) {
      return o.flights;
    })
  );

  drawChart(maxY, noOfAirlines);
};

/*** FUNCTION TO DRAW CHART ***/
drawChart = (maxY, data) => {
  var myLineChart = new LineChart({
    canvasId: "myCanvas",
    minX: 0,
    minY: 0,
    maxX: 23,
    maxY: maxY,
    unitsPerTickX: 1,
    unitsPerTickY: Math.round(maxY / 10)
  });

  myLineChart.drawLine(data, "skyblue", 3);
};

/*** DRAW CHART ON INITIAL RENDER ***/
window.onload = function() {
  populateData(airlineData, "All Airlines");
};

/*** SEARCH BAR EVENT HANDLER ***/
onChangeHandler = e => {
  globalValues["value"] = e.value;

  let airlineVal = [];
  let airlineArray = Object.values(airlines);
  airlineArray.forEach(airline => {
    if (airline.toLowerCase().includes(e.value.toLowerCase())) {
      airlineVal.push(airline);
    }
  });

  let key = Object.keys(airlines).find(key => airlines[key] === airlineVal[0]);

  if (e.value === "" || key === undefined) filterData("All");
  else filterData(key);
};

/*** FUNCTIONS TO DRAW LINE CHART USING HTML5 CANVAS***/
function LineChart(obj) {
  this.canvas = document.getElementById(obj.canvasId);
  this.minX = obj.minX;
  this.minY = obj.minY;
  this.maxX = obj.maxX;
  this.maxY = obj.maxY;
  this.unitsPerTickX = obj.unitsPerTickX;
  this.unitsPerTickY = obj.unitsPerTickY;

  this.padding = 10;
  this.tickSize = 10;
  this.axisColor = "#555";
  this.pointRadius = 5;
  this.font = "12pt Calibri";
  this.fontHeight = 12;

  this.context = this.canvas.getContext("2d");
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.rangeX = this.maxX - this.minX;
  this.rangeY = this.maxY - this.minY;
  this.numXTicks = Math.round(this.rangeX / this.unitsPerTickX);
  this.numYTicks = Math.round(this.rangeY / this.unitsPerTickY);
  this.x = this.getLongestValueWidth() + this.padding * 2;
  this.y = this.padding * 2;
  this.width = this.canvas.width - this.x - this.padding * 2;
  this.height = this.canvas.height - this.y - this.padding - this.fontHeight;
  this.scaleX = this.width / this.rangeX;
  this.scaleY = this.height / this.rangeY;

  this.drawXAxis();
  this.drawYAxis();
}

LineChart.prototype.getLongestValueWidth = function() {
  this.context.font = this.font;
  var longestValueWidth = 0;
  for (var n = 0; n <= this.numYTicks; n++) {
    var value = this.maxY - n * this.unitsPerTickY;
    longestValueWidth = Math.max(
      longestValueWidth,
      this.context.measureText(value).width
    );
  }
  return longestValueWidth;
};

LineChart.prototype.drawXAxis = function() {
  var context = this.context;
  context.save();
  context.beginPath();
  context.moveTo(this.x, this.y + this.height);
  context.lineTo(this.x + this.width, this.y + this.height);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 4;
  context.stroke();

  for (var n = 0; n < this.numXTicks; n++) {
    context.beginPath();
    context.moveTo(
      ((n + 1) * this.width) / this.numXTicks + this.x,
      this.y + this.height
    );
    context.lineTo(
      ((n + 1) * this.width) / this.numXTicks + this.x,
      this.y + this.height - this.tickSize
    );
    context.stroke();
  }

  context.font = this.font;
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (var n = 0; n < this.numXTicks; n++) {
    var label = Math.round(((n + 1) * this.maxX) / this.numXTicks);
    context.save();
    context.translate(
      ((n + 1) * this.width) / this.numXTicks + this.x,
      this.y + this.height + this.padding
    );
    context.fillText(labelArray[label], 0, 0, 30);
    context.restore();
  }
  context.restore();
};

LineChart.prototype.drawYAxis = function() {
  var context = this.context;
  context.save();
  context.save();
  context.beginPath();
  context.moveTo(this.x, this.y);
  context.lineTo(this.x, this.y + this.height);
  context.strokeStyle = this.axisColor;
  context.lineWidth = 4;
  context.stroke();
  context.restore();

  for (var n = 0; n < this.numYTicks; n++) {
    context.beginPath();
    context.moveTo(this.x, (n * this.height) / this.numYTicks + this.y);
    context.lineTo(
      this.x + this.tickSize,
      (n * this.height) / this.numYTicks + this.y
    );
    context.stroke();
  }

  context.font = this.font;
  context.fillStyle = "black";
  context.textAlign = "right";
  context.textBaseline = "middle";

  for (var n = 0; n < this.numYTicks; n++) {
    var value = Math.round(this.maxY - (n * this.maxY) / this.numYTicks);
    context.save();
    context.translate(
      this.x - this.padding,
      (n * this.height) / this.numYTicks + this.y
    );
    context.fillText(value, 0, 0);
    context.restore();
  }
  context.restore();
};

LineChart.prototype.drawLine = function(data, color, width) {
  var context = this.context;
  context.save();
  this.transformContext();
  context.lineWidth = width;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(data[0].time * this.scaleX, data[0].flights * this.scaleY);
  for (var n = 0; n < data.length; n++) {
    var point = data[n];
    context.lineTo(point.time * this.scaleX, point.flights * this.scaleY);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(
      point.time * this.scaleX,
      point.flights * this.scaleY,
      this.pointRadius,
      0,
      2 * Math.PI,
      "blue"
    );
    context.fill();
    context.closePath();

    context.beginPath();
    context.moveTo(point.time * this.scaleX, point.flights * this.scaleY);
  }
  context.restore();
};

LineChart.prototype.transformContext = function() {
  var context = this.context;
  this.context.translate(this.x, this.y + this.height);
  context.scale(1, -1);
};
