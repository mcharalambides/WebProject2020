var previousCircle;
var map;
$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const id = urlParams.get('id');

    document.getElementById("homeLink").setAttribute('href','home.html?username='+username );
    document.getElementById("user").value = username;
    document.getElementById("id").value = id;
    document.getElementById("uploadFileLink").setAttribute('href','UploadFile.html?id='+id+'&'+'username='+username );
    document.getElementById("homeLink").setAttribute('href','home.html?username='+username+'&id='+id);

    //INITIALIZE MAP
    map = L.map('map').setView([38.230462,21.753150], 13);//KENTRO THS PATRAS

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function(e){
        if(previousCircle != null){
            map.removeLayer(previousCircle);
        }
        
        previousCircle = L.circle(e.latlng, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);
    });

});

$("#decrease").on("click", function() {
    var radius = previousCircle.getRadius();
    if(radius <= 0)
        map.removeLayer(previousCircle);
    else 
        previousCircle.setRadius(radius - 50);
});

$("#increase").on("click", function() {
    var radius = previousCircle.getRadius();
    if(radius <= 0)
        map.removeLayer(previousCircle);
    else 
        previousCircle.setRadius(radius + 50);
});

$("#remove").on("click", function() {
    
    map.removeLayer(previousCircle);

});

