<?php


$link = mysqli_connect("127.0.0.1","root","","Project2020","3307");

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

if(isset($_GET["usrname"]))
    $usrname = mysqli_real_escape_string($link,$_GET["usrname"]);
if(isset($_GET["pass"]))
    $pass = ($_GET["pass"]);    
if(isset($_GET["email"]))
    $email = ($_GET["email"]);
if(isset($_GET["id"]))
    $id = ($_GET["id"]);

$action = ($_GET["action"]);

if($action == 'LogOut'){
    echo '<script language="javascript"> 
            alert("Logging Out"); 
            window.location.href=" ../templates/login.html"; 
            </script>';
}

$data = json_decode(file_get_contents("php://input"));

if($action == "Register"){
    //2-WAY ENCRYPTION
    $cipher = "aes-128-gcm";
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($ivlen);
    $id = openssl_encrypt($email, $cipher, $pass, $options=0, $iv, $tag);

    //HASHING PASSWORD
    $pass = password_hash($pass, PASSWORD_DEFAULT);

    $response = mysqli_query($link,"INSERT INTO Users(id,username,password,email)VALUES('".$id."','".$usrname."','".$pass."','".$email."')");
    if($response)
    header('Location: ../templates/login.html');

}
else if($action == "Home"){
    $response = mysqli_query($link,"SELECT * FROM Users WHERE id='".$id."'");
    $response = $response->fetch_all(MYSQLI_ASSOC);
    if($response[0]["last_upload"] == null){
        echo json_encode($response);
        exit;
    }

    //GET PERIOD OF RECORDS
    $temp = mysqli_query($link,"select min(timestampMs) AS MIN, max(timestampMs) AS MAX from Arxeio where user_id ='".$id."'");
    $temp = $temp->fetch_all(MYSQLI_ASSOC);
    if(count($temp) == 0){
        echo ' iam here';
        echo json_encode($temp);
        exit;
    }
    $max = $temp[0]["MAX"]; $min = $temp[0]["MIN"];

    //GET DAY WITH THE MOST THE MOST RECORDS
    /* $temp1 = mysqli_query($link, "SELECT day(subTimestampMs) AS time,count(*) AS points FROM `Activity` WHERE user_id='".$id."'GROUP BY day(subTimestampMs)");
    $temp1 = $temp1->fetch_all(MYSQLI_ASSOC);
    $MAX_DAY = $temp1; */

    //GET DAY OF THE WEEK WITH THE MOST THE MOST RECORDS
    /* $temp2 = mysqli_query($link, "SELECT dayofweek(subTimestampMs) AS time,count(*) AS points FROM `Activity` WHERE user_id='".$id."'GROUP BY dayofweek(subTimestampMs)");
    $temp2 = $temp2->fetch_all(MYSQLI_ASSOC);
    $MAX_DAYOFWEEK = $temp2; */

    //NUMBER OF ACTIVITIES 
    $temp3 = mysqli_query($link,"select type AS activity,count(*) AS points from Activity where user_id='".$id."'group by type");
    $temp3 = $temp3->fetch_all(MYSQLI_ASSOC);
    $ACTIVITIES = $temp3;

    $response2 = mysqli_query($link,"SELECT latitudeE7,longitudeE7 FROM Arxeio WHERE user_id='".$id."'");
    $response2 = $response2->fetch_all(MYSQLI_ASSOC);
    $response["ACTIVITIES"] = $ACTIVITIES;
    $response["coords"] = $response2;
    $response["MAX"] = $max; 
    $response["MIN"] = $min;
    echo json_encode($response);
}
else if ($action == "Query"){
    $days = mysqli_query($link,$_GET["Query1"]);
    $days = $days->fetch_all(MYSQLI_ASSOC);
    $weeks = mysqli_query($link,$_GET["Query2"]);
    $weeks = $weeks->fetch_all(MYSQLI_ASSOC);
    $response["MAX_DAY"] = $days;
    $response["MAX_DAYOFWEEK"] = $weeks;
    echo json_encode($response);
}
else{
    $result = mysqli_query($link,"SELECT * FROM Users WHERE username='".$usrname."'");
    $result = $result->fetch_all(MYSQLI_ASSOC);

    if(count($result) > 0){
        for($i = 0; i<count($result); $i++){
            if(password_verify($pass,$result[$i]["password"]) == 1){
                header('Location: ../templates/home.html?username='.$result[$i]["username"].'&id='.$result[$i]["id"]);
                exit;
            }
            else
                echo 'INVALID INPUT';
        }
    }
    else
        echo 'INVALID INPUT';
}

mysqli_close($link);
   
?>
