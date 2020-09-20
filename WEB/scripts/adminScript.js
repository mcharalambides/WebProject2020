var heat;
var previousChart;
var months = {"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July",
              "8":"August","9":"September","10":'October',"11":"November","12":"December"};
var week = {"1":"Sun","2":"Mon","3":"Tue","4":"Wed","5":"Thu","6":"Fri","7":"Sat"};
var hours = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"11":11,"12":12,"13":13,
            "14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":21,"22":22,"23":23};
var obj;
$(document).ready(function() {

    $.get("../php/admin.php", {'action': "Home"}, function(data){
        obj = JSON.parse(JSON.stringify($.parseJSON(data)));

    
          //POPULATE YEARS
           var options = obj["but6"];
          $('#year1').empty();
          $('#year1').append($('<option>--OPTIONS--</option>').val(null));
          $('#year2').append($('<option>--OPTIONS--</option>').val(null));
          $.each(options, function(i, p) {
              $('#year1').append($('<option></option>').val(p["category"]).html(p["category"]));
              $('#year2').append($('<option></option>').val(p["category"]).html(p["category"]));
          }); 

          //POPULATE MONTHS
         $('#month1').empty();
          $('#month1').append($('<option>--OPTIONS--</option>').val(null));
          $('#month2').append($('<option>--OPTIONS--</option>').val(null));
          $.each(months, function(i, p) {
              $('#month1').append($('<option></option>').val(i).html(p));
              $('#month2').append($('<option></option>').val(i).html(p));
          });
          
          $('#day1').empty();
          $('#day2').empty();
          $('#day1').append($('<option>--OPTIONS--</option>').val(null));
          $('#day2').append($('<option>--OPTIONS--</option>').val(null));
          $.each(week, function(i, p) {
              $('#day1').append($('<option></option>').val(i).html(p));
              $('#day2').append($('<option></option>').val(i).html(p));
          });
          
          $('#hour1').empty();
          $('#hour2').empty();
          $('#hour1').append($('<option>--OPTIONS--</option>').val(null));
          $('#hour2').append($('<option>--OPTIONS--</option>').val(null));
          $.each(hours, function(i, p) {
              $('#hour1').append($('<option></option>').val(i).html(p));
              $('#hour2').append($('<option></option>').val(i).html(p));
          }); 

          addRow();


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
});



function addRow(){
  var table = document.getElementById("myTable");

      var tr = table.insertRow(table.rows.length);

      var th = document.createElement('th');
      th.innerHTML = "Type";
      th.setAttribute("scope","row");
      tr.appendChild(th);

      //CREATE DROPDOWN FOR FIRST CELL
      var td = tr.insertCell(1);

        var selectList = document.createElement("select");
        selectList.setAttribute("class", "selectType");

        var option = document.createElement("option");
        option.innerHTML = "--OPTIONS--";
        option.setAttribute("value","");
        selectList.appendChild(option);
        
        for (var j = 0; j < obj["but1"].length; j++) {
          option = document.createElement("option");
          option.setAttribute("value", obj["but1"][j]["category"]);
          option.text = obj["but1"][j]["category"];
          selectList.appendChild(option);
        }

        td.appendChild(selectList);
     
        //CREATE BUTTON FOR SECOND CELL
      td = tr.insertCell(2);
      var button = document.createElement("button");
      button.setAttribute("class","addRow");
      button.innerHTML = "+";
      button.setAttribute("onclick","addRow()");
      td.appendChild(button);
    
  }

  function getValues(){
    var values = document.getElementsByClassName("selectType");
    var array = [];

    for(var i=0; i<values.length; i++){
      var value = values[i].options[values[i].selectedIndex].value;
      if(!(value == ""))
        array.push("'" + value + "'");
    }

    return array;
  }

$(".button1").on("click", function(){
    if(previousChart != null){
        previousChart.dispose();
        initChart(obj['but1']);
    }
    else
        initChart(obj['but1']);
        
});

$(".button2").on("click", function(){
    if(previousChart != null){
        previousChart.dispose();
        initBarChart(obj['but2']);
    }
    else
        initBarChart(obj['but2']);
        
});

$(".button3").on("click", function(){
    for(var i=0; i<obj['but3'].length; i++)
        obj['but3'][i]["category"] = months[i+1];

    if(previousChart != null){
        previousChart.dispose();
        initBarChart(obj['but3']);
    }
    else
        initBarChart(obj['but3']);
        
});

$(".button4").on("click", function(){

    for(var i=0; i<obj['but4'].length; i++)
        obj['but4'][i]["category"] = week[i+1];  
      
    if(previousChart != null){
        previousChart.dispose();
        initBarChart(obj['but4']);
    }
    else
        initBarChart(obj['but4']);
        
});

$(".button5").on("click", function(){
    if(previousChart != null){
        previousChart.dispose();
        initBarChart(obj['but5']);
    }
    else
        initBarChart(obj['but5']);
        
});

$(".button6").on("click", function(){
    if(previousChart != null){
        previousChart.dispose();
        initBarChart(obj['but6']);
    }
    else
        initBarChart(obj['but6']);
        
});

$("#displayOnMap").on("click", function(){
  
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

  e = document.getElementById("day1");
  var maxDAY = e.options[e.options.length-1].value;
  var minDAY = e.options[1].value;
  var day1 = e.options[e.selectedIndex].value;
  e = document.getElementById("day2");
  var day2 = e.options[e.selectedIndex].value; 

  e = document.getElementById("hour1");
  var maxHOUR = e.options[e.options.length-1].value;
  var minHOUR = e.options[1].value;
  var hour1 = e.options[e.selectedIndex].value;
  e = document.getElementById("hour2");
  var hour2 = e.options[e.selectedIndex].value; 

  //CREATE TYPE SET
  if(!getValues().length == 0)
    var set = " and type in (" + getValues().join(",") + ")";
  else
    var set = " ";

  var condition = "WHERE year(Arxeio.timestampMs)>=! and year(Arxeio.timestampMs)<=@ and month(Arxeio.timestampMs)>=# and month(Arxeio.timestampMs)<=$" +  
                    " and dayofweek(Arxeio.timestampMs)>=% and dayofweek(Arxeio.timestampMs)<=^ and hour(Arxeio.timestampMs)>=& and hour(Arxeio.timestampMs)<=*" + set + " GROUP BY Arxeio.user_id,Arxeio.timestampMs";
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

  if(day1 != "")
    condition = condition.replace("%",day1);
  else
    condition = condition.replace("%",minDAY);

  if(day2 != "")
    condition = condition.replace("^",day2);
  else
    condition = condition.replace("^",maxDAY);

  if(hour1 != "")
    condition = condition.replace("&",hour1);
  else
    condition = condition.replace("&",minHOUR);

  if(hour2 != "")
    condition = condition.replace("*",hour2);
  else
    condition = condition.replace("*",maxHOUR);

  var query = "SELECT latitudeE7,longitudeE7 FROM Arxeio LEFT JOIN Activity on Arxeio.user_id = Activity.user_id AND Arxeio.timestampMs = Activity.timestampMs " + condition;
  

   $.get("../php/admin.php", {'action': "Query", 'Query':query}, function(data){
    data = $.parseJSON(data);
    console.log(data);
    initMap(data["coords"]);

  }).fail(function(textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  }); 

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


function initChart(data){

  //GRAFIKES PARASTASEIS
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        
        // Create chart instance
        $("#barchart").show();
        var chart = am4core.create("barchart", am4charts.PieChart);
        previousChart = chart;

        //PERNAME TA DEDOMENA STO CHART
        for(var i=0; i<data.length; i++)
          chart.data[i] = data[i];   
          
          var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "points";
            pieSeries.dataFields.category = "category";
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.slices.template.strokeWidth = 2;
            pieSeries.slices.template.strokeOpacity = 1;

            // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;

        chart.radius = 100;

    });

    
}

function initBarChart(data){

    //CREATE BARCHART
    $("#barchart").show();
    var barChart = am4core.create("barchart", am4charts.XYChart);
    previousChart = barChart;

    for(var i=0; i<data.length; i++){
      barChart.data[i] = data[i];
    }
    
    barChart.padding(40, 40, 40, 40);

    var categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.inversed = false;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.extraMax = 0.1;

    var series = barChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "category";
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
$("#dataDelete").on("click",function(){
    if (confirm('Are you sure you want to delete all data from the database?')) {
        query1 = "DELETE FROM Arxeio";
        query2 = "DELETE FROM Activity";
        $.get("../php/admin.php", {'action': "Delete", 'Query1':query1, 'Query2':query2},function(data){
          alert(data);
          window.location.href="adminPanel.html"
        })
        .fail(function(textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log( "Request Failed: " + err );
        }); 
      } else {
        // Do nothing!
      }
})




$(document).ready(function () {
   $("#confirm").click(function () {
       $.ajax({
               type: "POST",
               url: "../php/insert.php",
           })
           .done(function (msg) {
               alert("Data Saved: " + msg);
           });
   });
});
