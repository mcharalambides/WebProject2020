var heat;
var previousChart;
var previousChart2;
var months = {"0":"January","1":"February","2":"March","3":"April","4":"May","5":"June","6":"July",
              "7":"August","8":"September","9":'October',"10":"November","11":"December"};

$(document).ready(function() {

    $("#header").load("header.html"); 

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    var id;

    document.getElementById("homeLink").setAttribute('href','home.html?username='+username );

    $.get("../php/insert.php", {'usrname': username, 'action': "Home"}, function(data){
        console.log(data);
        
        var obj = $.parseJSON(data);
        document.getElementById("email").innerHTML = obj[0]['email'];
        document.getElementById("username").innerHTML = username;
        document.getElementById("uploadFileLink").setAttribute('href','UploadFile.html?id='+obj[0]['id']+'&'+'username='+username );

    });

    //HEATMAP
    var map = L.map('map').setView([38.230462,21.753150], 13);//KENTRO THS PATRAS

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.circle([38.230462,21.753150], {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10000
  }).addTo(map);
    
     heat = L.heatLayer([], {radius: 25}).addTo(map);

     map.on('click', function(e){
       console.log(e.latlng);
     });


     //GET THE JSON FILE
     var jqxhr = $.getJSON( "../upload/" + username + ".json",function(data){
      dataCopy = JSON.parse(JSON.stringify(data));

        initMap(dataCopy.locations);
        initChart(dataCopy.locations);
        fillDropdowns();
  
    }).fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
      if(error === "Not Found")
        $('.wrapper').text('YOU NEED TO UPLOAD A FILE FIRST');
  });


});

var dataCopy;

$("#year").on("change",function() {

  console.log(minDate,maxDate);

});

function initMap(data){
    var obj;

    console.log(Object.keys(data).length);
    console.log(data.length);

    //DIAVASE OLA TA SHMEIA APO TO ARXEIO
    for(var i=0; i<data.length; i++){
        obj = data[i];
        point1 = obj.latitudeE7 / 10000000;
        point2 = obj.longitudeE7 / 10000000;
        heat.addLatLng([point1,point2,0.2]);
    }
}

function fillDropdowns(){
  
  for(var i=minDate.getFullYear(); i<=maxDate.getFullYear(); i++)
    $('#year').append($('<option></option>').val(i).html(i));  

  for(x in months)
    $('#month').append($('<option></option>').val(months[x]).html(months[x]));
  
}

var maxDate=0,minDate=9999999999999;

function initChart(data){
var vehicle=0,bicycle=0,foot=0,running = 0,still=0,tilting=0,unknown=0,walking=0;

var array = {"IN_VEHICLE":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "ON_BICYCLE":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "ON_FOOT":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "RUNNING":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "STILL":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "TILTING":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "UNKNOWN":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}],
              "WALKING":[{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},{"0":0,"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,
              "14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}]
            };

var date;

for(var i=0; i<data.length; i++){
    obj = data[i];

    //VRISKOUME ITN MAX KAI MIN DATE TOU ARXEIOU
    if(parseInt(obj.timestampMs) > maxDate)
      maxDate = parseInt(obj.timestampMs);

    if(parseInt(obj.timestampMs) < minDate)
      minDate = parseInt(obj.timestampMs);

    if("activity" in obj)
        for(var j=0; j<obj.activity.length; j++){
            date = new Date(parseInt(obj.activity[j].timestampMs));

            //#KATIGORIWN, MERES, WRES
            for(var k=0; k<obj.activity[j].activity.length; k++)
                switch (obj.activity[j].activity[k].type) {
                    case "IN_VEHICLE":
                      vehicle++;
                      array["IN_VEHICLE"][0][date.getDay().toString()]++;
                      array["IN_VEHICLE"][1][date.getHours().toString()]++;
                      break;
                    case "ON_BICYCLE":
                      bicycle++;
                      array["ON_BICYCLE"][0][date.getDay().toString()]++;
                      array["ON_BICYCLE"][1][date.getHours().toString()]++;                     
                      break;
                    case "ON_FOOT":
                      foot++;
                      array["ON_FOOT"][0][date.getDay().toString()]++;
                      array["ON_FOOT"][1][date.getHours().toString()]++;                      
                      break;
                    case "RUNNING":
                      running++;
                      array["RUNNING"][0][date.getDay().toString()]++;
                      array["RUNNING"][1][date.getHours().toString()]++;                       
                      break;
                    case "STILL":
                      still++;
                      array["STILL"][0][date.getDay().toString()]++;
                      array["STILL"][1][date.getHours().toString()]++;                       
                      break;
                    case "TILTING":
                      tilting++;
                      array["TILTING"][0][date.getDay().toString()]++;
                      array["TILTING"][1][date.getHours().toString()]++;                      
                      break;
                    case "UNKNOWN":
                      unknown++;
                      array["UNKNOWN"][0][date.getDay().toString()]++;
                      array["UNKNOWN"][1][date.getHours().toString()]++;                      
                      break;
                    case "IN_ROAD_VEHICLE":
                        vehicle++;
                        array["IN_VEHICLE"][0][date.getDay().toString()]++;
                        array["IN_VEHICLE"][1][date.getHours().toString()]++;                        
                        break;
                    case "IN_FOUR_WHEELER_VEHICLE":
                        vehicle++;
                        array["IN_VEHICLE"][0][date.getDay().toString()]++;
                        array["IN_VEHICLE"][1][date.getHours().toString()]++;                       
                        break;
                    case "WALKING":
                      walking++;
                      array["WALKING"][0][date.getDay().toString()]++;
                      array["WALKING"][1][date.getHours().toString()]++;                      
                      break;
                    case "IN_CAR":
                      vehicle++;
                      array["IN_VEHICLE"][0][date.getDay().toString()]++;
                      array["IN_VEHICLE"][1][date.getHours().toString()]++;                      
                      break;
                  }
                }  
  }

  //CREATE PERIOD STRING
  minDate = new Date(minDate);
  maxDate = new Date(maxDate);

  var period = minDate.getDate() + "/" + (minDate.getMonth() + 1) + "/" + minDate.getFullYear() + " - "
               + maxDate.getDate().toString() + "/" + (1 + maxDate.getMonth()) + "/" + maxDate.getFullYear();
  document.getElementById("period").innerHTML = period;

  console.log(array);

  //GRAFIKES PARASTASEIS
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        var chart = am4core.create("piechart", am4charts.PieChart);
        
        var ob1 = '{ "activity":"IN_VEHICLE", "points":' + vehicle.toString() + '}';
        var ob2 = '{ "activity":"ON_BICYCLE", "points":' + bicycle.toString() + '}';
        var ob3 = '{ "activity":"ON_FOOT", "points":' + foot.toString() + '}';
        var ob4 = '{ "activity":"RUNNING", "points":' + running.toString() + '}';
        var ob5 = '{ "activity":"STILL", "points":' + still.toString() + '}';
        var ob6 = '{ "activity":"TILTING", "points":' + tilting.toString() + '}';
        var ob7 = '{ "activity":"UNKNOWN", "points":' + unknown.toString() + '}';
        var ob8 = '{ "activity":"WALKING", "points":' + walking.toString() + '}';


        chart.data = [ JSON.parse(ob1), JSON.parse(ob2), JSON.parse(ob3), JSON.parse(ob4), 
                        JSON.parse(ob5), JSON.parse(ob6), JSON.parse(ob7), JSON.parse(ob8) ];
          
          
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

          if(previousChart!= null)
             previousChart.dispose();

          //CREATE BARCHART
          var barChart = am4core.create("barchart", am4charts.XYChart);
          previousChart = barChart;

          var chartData = [];
          for(var i=0; i<24; i++){
            chartData[i] = {"time":23-i, "points":array[ev.target.dataItem.category][1][23-i]}
          }  

          console.log(chartData)
          barChart.data = chartData;
          barChart.padding(40, 40, 40, 40);

          var categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.dataFields.category = "time";
          categoryAxis.renderer.minGridDistance = 20;
          categoryAxis.renderer.inversed = true;
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
            return chart.colors.getIndex(target.dataItem.index);
           });

        //DAY OF THE WEEK CHART
            if(previousChart2!= null)
              previousChart2.dispose();

           //CREATE BARCHART 2
         var barChart2 = am4core.create("barchart2", am4charts.XYChart);
         previousChart2 = barChart2;

         var chartData2 = [];
         for(var i=0; i<=6; i++){
           chartData2[i] = {"time":6-i, "points":array[ev.target.dataItem.category][0][6-i]}
         }  

         console.log(chartData2)
         barChart2.data = chartData2;
         barChart2.padding(40, 40, 40, 40);

         var categoryAxis2 = barChart2.xAxes.push(new am4charts.CategoryAxis());
         categoryAxis2.renderer.grid.template.location = 0;
         categoryAxis2.dataFields.category = "time";
         categoryAxis2.renderer.minGridDistance = 20;// THE DISTANCE BETWEEN EACH BAR
         categoryAxis2.renderer.inversed = true;
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
           return chart.colors.getIndex(target.dataItem.index);
          });
          
        });

    });

    
}



