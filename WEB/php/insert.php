<?php
session_start();

$link = mysqli_connect("127.0.0.1", "root", "", "Project2020", "3307");

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

if (isset($_GET["usrname"]))
    $usrname = mysqli_real_escape_string($link, $_GET["usrname"]);
if (isset($_GET["pass"]))
    $pass = ($_GET["pass"]);
if (isset($_GET["email"]))
    $email = ($_GET["email"]);
if (isset($_GET["id"]))
    $id = ($_GET["id"]);
if (isset($_GET["action"]))
    $action = ($_GET["action"]);
else
    $action = null;

if ($action == 'LogOut') {
     session_destroy();
     echo '<script language="javascript"> 
            alert("Logging Out"); 
            window.location.href=" ../templates/login.html"; 
            </script>'; 
}

$data = json_decode(file_get_contents("php://input"));

if ($action == "Register") {
    //Get FirstName and LastName 
    if (isset($_GET["firstName"]))
        $first = ($_GET["firstName"]);

    if (isset($_GET["lastName"]))
        $last = ($_GET["lastName"]);

    //Checking that the username is not in use
    $response = mysqli_query($link, "SELECT * FROM Users WHERE username='" . $usrname . "'");
    $response = $response->fetch_all(MYSQLI_ASSOC);
    if (count($response) > 0) {
        echo '<script language="javascript"> 
        alert("THE USERNAME IS IN USE");
        window.location.href=" ../templates/register.html";
        </script>';
        exit;
    }

        //Checking for password 
        $flag = true;
    
        if(strlen($pass)<8)
            $flag = false;
        if(strtolower($pass) == $pass)
            $flag = false;
        if(strcspn($pass, '0123456789') == strlen($pass)) 
            $flag = false;
        if(strcspn($pass, "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~") == strlen($pass))
            $flag = false;
    
         if(!$flag){
            echo '<script language="javascript"> 
            alert("PASSWORD DOESNT MEET THE CRITERIA");
            window.location.href=" ../templates/register.html";
            </script>';
            exit;
        } 

    //2-WAY ENCRYPTION
    $cipher = "aes-128-gcm";
    $ivlen = openssl_cipher_iv_length($cipher);
    $iv = openssl_random_pseudo_bytes($ivlen);
    $id = openssl_encrypt($email, $cipher, $pass, $options = 0, $iv, $tag);

    //HASHING PASSWORD
    $pass = password_hash($pass, PASSWORD_DEFAULT);
    

    $response = mysqli_query($link, "INSERT INTO Users(id,username,password,email,FirstName,LastName)VALUES('" . $id . "','" . $usrname . "','" . $pass . "','" . $email . "','" . $first . "','" . $last . "')");
    if ($response) {
        echo '<script language="javascript"> 
        alert("Registration was succesful you will be redirected to login page");
        window.location.href=" ../templates/login.html";
        </script>';
    } 
    
} else if ($action == "Home") {

    $response = mysqli_query($link, "SELECT * FROM Users WHERE id='" . $id . "'");
    $response = $response->fetch_all(MYSQLI_ASSOC);
    if ($response[0]["last_upload"] == null) {
        echo json_encode($response);
        exit;
    }

    //GET PERIOD OF RECORDS
    $temp = mysqli_query($link, "SELECT min(timestampMs) AS MIN, max(timestampMs) AS MAX from Arxeio where user_id ='" . $id . "'");
    $temp = $temp->fetch_all(MYSQLI_ASSOC);
    if (count($temp) == 0) {
        echo json_encode($temp);
        exit;
    }
    $max = $temp[0]["MAX"];
    $min = $temp[0]["MIN"];

    $temp = mysqli_query($link, "SELECT year(timestampMs) AS YEARS from Arxeio where user_id ='" . $id . "' GROUP BY year(timestampMs)");
    $YEARS = $temp->fetch_all(MYSQLI_ASSOC);

    //NUMBER OF ACTIVITIES 
    $temp3 = mysqli_query($link, "SELECT type AS activity,count(*) AS points from Activity where user_id='" . $id . "'group by type");
    $temp3 = $temp3->fetch_all(MYSQLI_ASSOC);
    $ACTIVITIES = $temp3;

    //GET SCORE FOR LAST 12 MONTHS
    $score2 = mysqli_query($link, "CALL proc2('" . $id . "')");
    $score2 = mysqli_query($link, "SELECT score*100 as score,month from UserScores where score is not null");
    $score2 = $score2->fetch_all(MYSQLI_ASSOC);
    //GET TOP 3 SCORERS
    $score = mysqli_query($link, "CALL proc()");
    $score = mysqli_query($link, "SELECT user_id as ID, concat(Users.FirstName,' ', substring(Users.LastName,1,1)) AS 'USER',UserScores.score,UserScores.month FROM `UserScores` LEFT JOIN Users on Users.id=UserScores.user_id ORDER BY score DESC");
    $score = $score->fetch_all(MYSQLI_ASSOC);

    //GET COORDINATES
    $response2 = mysqli_query($link, "SELECT latitudeE7,longitudeE7 FROM Arxeio WHERE user_id='" . $id . "'");
    $response2 = $response2->fetch_all(MYSQLI_ASSOC);
    
    $response["ACTIVITIES"] = $ACTIVITIES;
    $response["coords"] = $response2;
    $response["MAX"] = $max;
    $response["MIN"] = $min;
    $response["YEARS"] = $YEARS;
    $response["12MONTHS"] = $score2;
    $response["LEADERBOARD"] = $score;
    echo json_encode($response);
} else if ($action == "Query") {
    //Getting new coordinates
    $coords = mysqli_query($link, $_GET["Query1"]);
    $coords = $coords->fetch_all(MYSQLI_ASSOC);

    //Getting new activity percentages
    $activities = mysqli_query($link, $_GET["Query2"]);
    $activities = $activities->fetch_all(MYSQLI_ASSOC);

    //Getting hours
    $response["coords"] = $coords;
    $response["activities"] = $activities;
    echo json_encode($response);
} else if ($action == "Query2") {
    //Getting new coordinates
    $days = mysqli_query($link, $_GET["Query1"]);
    $days = $days->fetch_all(MYSQLI_ASSOC);

    //Getting new activity percentages
    $week = mysqli_query($link, $_GET["Query2"]);
    $week = $week->fetch_all(MYSQLI_ASSOC);

    //Getting hours
    $response["MAX_DAY"] = $days;
    $response["MAX_DAYOFWEEK"] = $week;
    echo json_encode($response);
} else {
    $result = mysqli_query($link, "SELECT * FROM Admin WHERE username='" . $usrname . "' AND password='" . $pass . "'");
    $result = $result->fetch_all(MYSQLI_ASSOC);

    if (count($result) >= 1) {
        $_SESSION["admin"] = "admin";
        header('Location: ../templates/adminPanel.html');
        exit;
    }

    $result = mysqli_query($link, "SELECT * FROM Users WHERE username='" . $usrname . "'");
    $result = $result->fetch_all(MYSQLI_ASSOC);

    if (count($result) > 0) {
        for ($i = 0; $i < count($result); $i++) {
            if (password_verify($pass, $result[$i]["password"]) == 1) {
                $_SESSION["username"] = $usrname;
                 header('Location: ../templates/home.html?username=' . $result[$i]["username"] . '&id=' . $result[$i]["id"]);
                exit;  
            } else {
                echo '<script language="javascript"> 
                alert("INVALID CREDENTIALS"); 
                window.location.href=" ../templates/login.html"; 
                </script>';
            }
        }
    } else
        echo '<script language="javascript"> 
        alert("INVALID CREDENTIALS"); 
        window.location.href=" ../templates/login.html"; 
        </script>';
}

mysqli_close($link);
