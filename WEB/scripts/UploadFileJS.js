var previousCircle;

$(document).ready(function() {

    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const id = urlParams.get('id');

    document.getElementById("homeLink").setAttribute('href','home.html?username='+username );
    document.getElementById("uploadFileLink").setAttribute('href','UploadFile?username='+username );
    document.getElementById("user").value = username;
    document.getElementById("id").value = id;

    //INITIALIZE MAP
    var map = L.map('map').setView([38.230462,21.753150], 13);//KENTRO THS PATRAS

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

