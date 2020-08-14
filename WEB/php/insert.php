<?php

$response;

$link = mysqli_connect("127.0.0.1","root","","Project2020","3307");

if(isset($_GET["usrname"]))
    $user = ($_GET["usrname"]);
if(isset($_GET["pass"]))
    $pass = ($_GET["pass"]);    
if(isset($_GET["email"]))
    $email = ($_GET["email"]);
$action = ($_GET["action"]);


$data = json_decode(file_get_contents("php://input"));
$usrname = mysqli_real_escape_string($link,$user);
if(isset($pass))
    $pass = mysqli_real_escape_string($link,$pass);


if($action == "Register"){
    mysqli_query($link,"INSERT INTO Users(username,password,email)VALUES('".$usrname."','".$pass."','".$email."')");
    $resultArray = 'succes';
}
else if($action == "Home"){
    $response = mysqli_query($link,"SELECT * FROM Users WHERE username='".$usrname."'");

    $resultArray = $response->fetch_all(MYSQLI_ASSOC);

}
else{
    $result = mysqli_query($link,"SELECT * FROM Users WHERE username='".$usrname."'"." and password='".$pass."'");
    if(mysqli_num_rows($result) == 1){
        header('Location: ../templates/home.html?username='.$user);
        exit;
    }
    else{
         $resultArray = 'INVALID INPUT';
    } 
}    
   
 echo json_encode($resultArray);

?>
