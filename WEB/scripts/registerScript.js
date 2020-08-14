$("#registerButton").on("click",function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;
    console.log("The username is " + username);
    
    $.get( "../php/insert.php",{'usrname' : username, 'pass' : password, 'email' : email, 'action': 'Register'}, function( data ) {
      if(data == "succes"){
        alert("Registration was succesful you will be redirected to login page");
        window.location.href = "../templates/login.html";
      }

      }, "json");
});