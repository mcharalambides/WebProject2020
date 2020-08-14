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

    //2-WAY ENCRYPTION
    $cipher = "aes-128-gcm";
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($ivlen);
    $ciphertext = openssl_encrypt($email, $cipher, $pass, $options=0, $iv, $tag);

    mysqli_query($link,"INSERT INTO Users(id,username,password,email)VALUES('".$ciphertext."','".$usrname."','".$pass."','".$email."')");
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
