"use strict";

var heat;
var previousChart;
var previousChart2;
var dataCopy2;
var id;
var months = {
  "0": "January",
  "1": "February",
  "2": "March",
  "3": "April",
  "4": "May",
  "5": "June",
  "6": "July",
  "7": "August",
  "8": "September",
  "9": 'October',
  "10": "November",
  "11": "December"
};
$(document).ready(function () {
  $("#header").load("header.html");
  var urlParams = new URLSearchParams(window.location.search);
  var username = urlParams.get('username');
  id = urlParams.get('id');
  document.getElementById("homeLink").setAttribute('href', 'home.html?username=' + username + '&id=' + id);
  $.get("../php/insert.php", {
    'id': id,
    'action': "Home"
  }, function (data) {
    var obj = $.parseJSON(data);
    console.log(obj); //data = JSON.parse(JSON.stringify(data));

    if (obj[0]["last_upload"] == null) $('.wrapper').text('YOU NEED TO UPLOAD A FILE FIRST');else {
      //CALLING THE INITIALIZE MAP FUNCTION
      initMap(obj);
      initChart(obj.ACTIVITIES); //CREATE PERIOD STRING

      var period = obj["MIN"] + " - " + obj["MAX"];
      document.getElementById("period").innerHTML = period;
      document.getElementById("last_upload").innerHTML = obj[0]["last_upload"];
    }
    document.getElementById("email").innerHTML = obj[0]['email'];
    document.getElementById("username").innerHTML = username;
    document.getElementById("uploadFileLink").setAttribute('href', 'UploadFile.html?id=' + obj[0]['id'] + '&' + 'username=' + username);
  }).fail(function (textStatus, error) {
    var err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
  }); //HEATMAP

  var map = L.map('map').setView([38.230462, 21.753150], 13); //KENTRO THS PATRAS

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.circle([38.230462, 21.753150], {
    fill: false,
    radius: 10000
  }).addTo(map);
  heat = L.heatLayer([], {
    radius: 25
  }).addTo(map);
  map.on('click', function (e) {
    console.log(e.latlng);
  });
});
$("#year").on("change", function () {
  console.log(minDate, maxDate);
});

function initMap(data) {
  var obj; //console.log(Object.keys(data).length);

  console.log(data["coords"].length); //DIAVASE OLA TA SHMEIA APO TO ARXEIO

  for (var i = 1; i < data["coords"].length; i++) {
    obj = data["coords"][i];
    point1 = parseInt(obj.latitudeE7) / 10000000;
    point2 = parseInt(obj.longitudeE7) / 10000000;
    heat.addLatLng([point1, point2, 0.2]);
  }
}
/* function fillDropdowns(){
  
  for(var i=minDate.getFullYear(); i<=maxDate.getFullYear(); i++)
    $('#year').append($('<option></option>').val(i).html(i));  

  for(x in months)
    $('#month').append($('<option></option>').val(months[x]).html(months[x]));
  
} */


function initChart(data) {
  var vehicle = 0,
      bicycle = 0,
      foot = 0,
      running = 0,
      still = 0,
      tilting = 0,
      unknown = 0,
      walking = 0;
  var array = {
    "IN_VEHICLE": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "ON_BICYCLE": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "ON_FOOT": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "RUNNING": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "STILL": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "TILTING": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "UNKNOWN": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }],
    "WALKING": [{
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    }, {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    }]
  }; //GRAFIKES PARASTASEIS

  am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_animated); // Create chart instance

    var chart = am4core.create("piechart", am4charts.PieChart); //PERNAME TA DEDOMENA STO CHART

    for (var i = 0; i < data.length; i++) {
      chart.data[i] = data[i];
    }

    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "points";
    pieSeries.dataFields.category = "activity";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1; // This creates initial animation

    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    chart.radius = 100;
    pieSeries.slices.template.events.on("hit", function (ev) {
      $("#barchart").show();
      $("#barchart2").show();
      var category = ev.target.dataItem.category;
      var query1 = "SELECT hour(subTimestampMs) AS time,count(*) AS points FROM `Activity` WHERE user_id='" + id + "' and type = '" + category + "' GROUP BY hour(subTimestampMs)";
      var query2 = "SELECT dayofweek(subTimestampMs) AS time,count(*) AS points FROM `Activity` WHERE user_id='" + id + "' and type = '" + category + "' GROUP BY dayofweek(subTimestampMs)";
      var copyData;
      $.get("../php/insert.php", {
        'action': "Query",
        'Query1': query1,
        'Query2': query2
      }, function (data) {
        initBarChart1(data);
        initBarChart2(data);
      });
    });
  });
}

function initBarChart1(data) {
  data = JSON.parse(data);
  if (previousChart != null) previousChart.dispose(); //CREATE BARCHART

  var barChart = am4core.create("barchart", am4charts.XYChart);
  previousChart = barChart;

  for (var i = 0; i < data["MAX_DAY"].length; i++) {
    barChart.data[i] = data["MAX_DAY"][i];
  }

  barChart.padding(40, 40, 40, 40);
  var categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.dataFields.category = "time";
  categoryAxis.renderer.minGridDistance = 20;
  categoryAxis.renderer.inversed = false;
  categoryAxis.renderer.grid.template.disabled = true;
  var valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  valueAxis.extraMax = 0.1;
  var series = barChart.series.push(new am4charts.ColumnSeries());
  series.dataFields.categoryX = "time";
  series.dataFields.valueY = "points";
  series.tooltipText = "{valueY.value}";
  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadiusTopRight = 10;
  series.columns.template.column.cornerRadiusTopLeft = 10;
  var labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.verticalCenter = "bottom";
  labelBullet.label.dy = -10;
  labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
  barChart.zoomOutButton.disabled = true;
  series.columns.template.adapter.add("fill", function (fill, target) {
    return barChart.colors.getIndex(target.dataItem.index);
  });
}

function initBarChart2(data) {
  data = JSON.parse(data); //DAY OF THE WEEK CHART

  if (previousChart2 != null) previousChart2.dispose(); //CREATE BARCHART 2

  var barChart2 = am4core.create("barchart2", am4charts.XYChart);
  previousChart2 = barChart2;

  for (var i = 0; i < data["MAX_DAYOFWEEK"].length; i++) {
    barChart2.data[i] = data["MAX_DAYOFWEEK"][i];
  }

  barChart2.padding(40, 40, 40, 40);
  var categoryAxis2 = barChart2.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis2.renderer.grid.template.location = 0;
  categoryAxis2.dataFields.category = "time";
  categoryAxis2.renderer.minGridDistance = 20; // THE DISTANCE BETWEEN EACH BAR

  categoryAxis2.renderer.inversed = false;
  categoryAxis2.renderer.grid.template.disabled = true;
  var valueAxis2 = barChart2.yAxes.push(new am4charts.ValueAxis());
  valueAxis2.min = 0;
  valueAxis2.extraMax = 0.1;
  var series2 = barChart2.series.push(new am4charts.ColumnSeries());
  series2.dataFields.categoryX = "time";
  series2.dataFields.valueY = "points";
  series2.tooltipText = "{valueY.value}";
  series2.columns.template.strokeOpacity = 0;
  series2.columns.template.column.cornerRadiusTopRight = 10;
  series2.columns.template.column.cornerRadiusTopLeft = 10;
  var labelBullet2 = series2.bullets.push(new am4charts.LabelBullet());
  labelBullet2.label.verticalCenter = "bottom";
  labelBullet2.label.dy = -10;
  labelBullet2.label.text = "{values.valueY.workingValue.formatNumber('#.')}";
  barChart2.zoomOutButton.disabled = true;
  series2.columns.template.adapter.add("fill", function (fill, target) {
    return barChart2.colors.getIndex(target.dataItem.index);
  });
}