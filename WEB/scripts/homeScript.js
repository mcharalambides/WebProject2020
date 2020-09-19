var heat;
var previousPie;
var previousChart;
var previousChart2;
var id;
var months = {"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July",
              "8":"August","9":"September","10":'October',"11":"November","12":"December"};
var week = {"1":"Sun","2":"Mon","3":"Tue","4":"Wed","5":"Thu","6":"Fri","7":"Sat"};

$(document).ready(function() {

    $("#header").load("header.html"); 


    //const urlParams = new URLSearchParams(window.location.search);
    var url = new URL(document.URL);
    var urlParams = url.search;
    var urlParams = urlParams.slice(1,urlParams.length);
    var params = urlParams.split("&");
    const username = params[0].replace("username=","");
    id = params[1].replace("id=","");

    document.getElementById("homeLink").setAttribute('href','home.html?username='+username+'&id='+id);

    $.get("../php/insert.php", {'id': id, 'action': "Home"}, function(data){
        var obj = $.parseJSON(data);
        console.log(obj);

        if(obj[0]["last_upload"] == null)
          $('.wrapper').text('YOU NEED TO UPLOAD A FILE FIRST');
        else{
          //CREATE PERIOD STRING
          var period = obj["MIN"] + " - " + obj["MAX"];
          document.getElementById("period").innerHTML = period;
          document.getElementById("last_upload").innerHTML = obj[0]["last_upload"];

          //POPULATE SCORE TABLE
          populateScore(obj['LEADERBOARD'], obj['12MONTHS']);

          //POPULATE YEARS
          var options = obj["YEARS"];
          $('#year1').empty();
          $('#year1').append($('<option>--OPTIONS--</option>').val(null));
          $('#year2').append($('<option>--OPTIONS--</option>').val(null));
          $.each(options, function(i, p) {
              $('#year1').append($('<option></option>').val(p["YEARS"]).html(p["YEARS"]));
              $('#year2').append($('<option></option>').val(p["YEARS"]).html(p["YEARS"]));
          });

          //POPULATE MONTHS
          $('#month1').empty();
          $('#month1').append($('<option>--OPTIONS--</option>').val(null));
          $('#month2').append($('<option>--OPTIONS--</option>').val(null));
          $.each(months, function(i, p) {
              $('#month1').append($('<option></option>').val(i).html(p));
              $('#month2').append($('<option></option>').val(i).html(p));
          });

        }

        document.getElementById("email").innerHTML = obj[0]['email'];
        document.getElementById("username").innerHTML = username;
        document.getElementById("uploadFileLink").setAttribute('href','UploadFile.html?id='+obj[0]['id']+'&'+'username='+username );

    }).fail(function(textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
    });

    //HEATMAP
    var map = L.map('map').setView([38.230462,21.753150], 13);//KENTRO THS PATRAS

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.circle([38.230462,21.753150], {
      fill:false,
      radius: 10000
    }).addTo(map);
    
     heat = L.heatLayer([], {radius: 25}).addTo(map);

     map.on('click', function(e){
       console.log(e.latlng);
     });

});

function populateScore(leaderboard,months){

  var table = document.getElementById("scoreTable");
  var tr;
  var flag = false;

  //POPULATE SCORE TABLE
  for(var i=0; i<3; i++){
    if(leaderboard[i]["score"] != null){
      if(leaderboard[i]["ID"] == id)
        flag = true;
      tr = table.insertRow(i+1);
      tr.insertCell(0).innerHTML = i+1;
      tr.insertCell(1).innerHTML = leaderboard[i]["USER"];
      tr.insertCell(2).innerHTML = leaderboard[i]["score"];
    }
  }

  if(!flag){
    for(var j=0; j<leaderboard.length; j++){
      if(leaderboard[j]["ID"] == id && leaderboard[j]["score"]!= null){
        tr = table.insertRow(i+1);
        tr.insertCell(0).innerHTML = j+1;
        tr.insertCell(1).innerHTML = leaderboard[j]["USER"];
        tr.insertCell(2).innerHTML = leaderboard[j]["score"];
      }
    }
  }

      //CREATE BARCHART FOR THE SCORE OF THE LAST 12 MONTHS
      var barChart = am4core.create("barchart3", am4charts.XYChart);

      for(var i=0; i<months.length; i++)
        barChart.data[i] = months[i];
      
      barChart.padding(40, 40, 40, 40);
  
      var categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "month";
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.grid.template.disabled = true;
  
      var valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = 0;
      valueAxis.max = 100;
  
      var series = barChart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "month";
      series.dataFields.valueY = "score";
      series.tooltipText = "{valueY.value}"
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


$("#display").on("click", function(){
  //Dispose old graphs
  if(previousPie!= null)
    previousPie.dispose();

  if(previousChart != null){
    previousChart.dispose();
    $("#barchart").css("display","none");
  }

  if(previousChart2 != null){
    previousChart2.dispose();
    $("#barchart2").css("display","none");
  }
  
  var e = document.getElementById("year1");
  var maxYEAR = e.options[e.options.length-1].value;
  var minYEAR = e.options[1].value;
  var year1 = e.options[e.selectedIndex].value;
  e = document.getElementById("year2");
  var year2 = e.options[e.selectedIndex].value;

  e = document.getElementById("month1");
  var maxMONTH = e.options[e.options.length-1].value;
  var minMONTH = e.options[1].value;
  var month1 = e.options[e.selectedIndex].value;

  e = document.getElementById("month2");
  var month2 = e.options[e.selectedIndex].value; 

  var condition = "WHERE year(timestampMs)>=! and year(timestampMs)<=@ and month(timestampMs)>=# and month(timestampMs)<=$";
  if(year1 != "")
    condition = condition.replace("!",year1);
  else
    condition = condition.replace("!",minYEAR);

  if(year2 != "")
    condition = condition.replace("@",year2);
  else
    condition = condition.replace("@",maxYEAR);

  if(month1 != "")
    condition = condition.replace("#",month1);
  else
    condition = condition.replace("#",minMONTH);

  if(month2 != "")
    condition = condition.replace("$",month2);
  else
    condition = condition.replace("$",maxMONTH);

  var query1 = "SELECT latitudeE7,longitudeE7 FROM Arxeio " + condition + " and user_id = '" + id +"'";
  var query2 = "select type AS activity,count(*) AS points from Activity "+ condition + " and user_id = '" + id +"' group by type";

  $.get("../php/insert.php", {'action': "Query", 'Query1':query1,'Query2':query2}, function(data){
    data = $.parseJSON(data);
    console.log(data);
    initMap(data["coords"]);
    initChart(data["activities"],condition);

  }).fail(function(textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

  window.location.href = "#piechart";
});

function initMap(data){
    var obj;
    heat.setLatLngs([]);

    //console.log(Object.keys(data).length);
    console.log(data.length);

    //DIAVASE OLA TA SHMEIA APO TO ARXEIO
    for(var i=1; i<data.length; i++){
        obj = data[i];
        point1 = parseInt(obj.latitudeE7) / 10000000;
        point2 = parseInt(obj.longitudeE7) / 10000000;
        heat.addLatLng([point1,point2,0.2]);
    }
}


function initChart(data,condition){

  //GRAFIKES PARASTASEIS
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        
        // Create chart instance
        $("#piechart").show();
        var chart = am4core.create("piechart", am4charts.PieChart);
        previousPie = chart;

        //PERNAME TA DEDOMENA STO CHART
        for(var i=0; i<data.length; i++)
          chart.data[i] = data[i];   
          
          var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "points";
            pieSeries.dataFields.category = "activity";
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.slices.template.strokeWidth = 2;
            pieSeries.slices.template.strokeOpacity = 1;

            // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;

        chart.radius = 100;

        pieSeries.slices.template.events.on("hit", function(ev){
          $("#barchart").show();
          $("#barchart2").show();

          var category = ev.target.dataItem.category;
          var query1 = "SELECT hour(subTimestampMs) AS time,count(*) AS points FROM `Activity` " +condition + " and user_id='" 
                        + id + "' and type = '" + category +"' GROUP BY hour(subTimestampMs)";
          var query2 = "SELECT dayofweek(subTimestampMs) AS time,count(*) AS points FROM `Activity` "+condition+" and user_id='" 
                        + id + "' and type = '" + category +"' GROUP BY dayofweek(subTimestampMs)";

          $.get("../php/insert.php", {'action': "Query2", 'Query1':query1, 'Query2':query2}, function(data){
            data = JSON.parse(data);
            console.log(data);
            initBarChart1(data);
            initBarChart2(data);
          });
    
        });

    });

    
}

function initBarChart1(data){

    //Dispose previous chart
    if(previousChart!= null)
      previousChart.dispose();

    //CREATE BARCHART
    var barChart = am4core.create("barchart", am4charts.XYChart);
    previousChart = barChart;

    for(var i=0; i<data["MAX_DAY"].length; i++)
      barChart.data[i] = data["MAX_DAY"][i];
    
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
    series.tooltipText = "{valueY.value}"
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

function initBarChart2(data){
  //Dispose previous chart
  if(previousChart2!= null)
    previousChart2.dispose();

  //CREATE BARCHART 2
  var barChart2 = am4core.create("barchart2", am4charts.XYChart);
  previousChart2 = barChart2;

  for(var i=0; i<data["MAX_DAYOFWEEK"].length; i++){
    data["MAX_DAYOFWEEK"][i]["time"] = week[i+1];
    barChart2.data[i] = data["MAX_DAYOFWEEK"][i];
  }

  barChart2.padding(40, 40, 40, 40);

  var categoryAxis2 = barChart2.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis2.renderer.grid.template.location = 0;
  categoryAxis2.dataFields.category = "time";
  categoryAxis2.renderer.minGridDistance = 20;// THE DISTANCE BETWEEN EACH BAR
  categoryAxis2.renderer.inversed = false;
  categoryAxis2.renderer.grid.template.disabled = true;

  var valueAxis2 = barChart2.yAxes.push(new am4charts.ValueAxis());
  valueAxis2.min = 0;
  valueAxis2.extraMax = 0.1;

  var series2 = barChart2.series.push(new am4charts.ColumnSeries());
  series2.dataFields.categoryX = "time";
  series2.dataFields.valueY = "points";
  series2.tooltipText = "{valueY.value}"
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



