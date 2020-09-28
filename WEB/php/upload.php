<?php


if(isset($_POST['username']))
    $username = $_POST['username'];
if(isset($_POST['id']))
    $id = $_POST['id'];

$radius = $_POST['radius']/1000;
$lat = $_POST['lat'];
$lng = $_POST['lng'];

if(isset($_POST['submit'])){
    $file = $_FILES['upload'];//To arxeio
    $fileName = $_FILES['upload']['name'];//Pairnoume to onoma tou arxeiou
    $fileTmpName = $_FILES['upload']['tmp_name'];

    //Pairnoume to extension
    $fileExt = explode('.', $fileName);
    $fileActualExt = end($fileExt);
    //Elegxoume oti einai json
    if(!((strcmp('json', $fileActualExt) == 0))){
        echo '<script language="javascript"> alert("You cannot upload files of this type!")
        window.location.href=" ../templates/home.html?username='.$_POST['username'].'&id='.$id.'"; </script>';
        exit;  
    }

    $myfile = fopen($fileTmpName, "r") or die("Unable to open file!");
    $myObject = json_decode(fread($myfile, filesize($fileTmpName)), true);

    $conn = new mysqli("127.0.0.1","root","", "Project2020");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
      }

      $sql ="INSERT INTO Arxeio(user_id,timestampMs,accuracy,latitudeE7,longitudeE7,heading,velocity,altitude,verticalAccuracy) VALUES ";
      $myString = "";
      $sql2 ="INSERT INTO Activity(user_id,timestampMs,subTimestampMs,type) VALUES ";
      $myString2 = "";  

    $flag = false;  
    for ($i = 0; $i < count($myObject["locations"]); $i++) {
        
        //CALCULATE DISTANCE FROM CENTER OF PATRAS
        if(10 < haversineGreatCircleDistance(38.230462, 21.753150, $myObject["locations"][$i]["latitudeE7"]/ 10000000 , $myObject["locations"][$i]["longitudeE7"]/ 10000000, 6371))
            continue;

        $flag = true;    

        if($radius != 0){
            if($radius > haversineGreatCircleDistance($lat,$lng, $myObject["locations"][$i]["latitudeE7"]/ 10000000 , $myObject["locations"][$i]["longitudeE7"]/ 10000000, 6371))
                continue; 
        }

        if(isset($myObject["locations"][$i]["heading"]))
            $heading = $myObject["locations"][$i]["heading"];
        else
            $heading = "null";
        if(isset($myObject["locations"][$i]["velocity"]))
            $velocity = $myObject["locations"][$i]["velocity"];
        else
            $velocity = "null";

        if(isset($myObject["locations"][$i]["altitude"]))
            $altitude = $myObject["locations"][$i]["altitude"];
        else
            $altitude = "null";

        if(isset($myObject["locations"][$i]["verticalAccuracy"]))
            $verticalAccuracy = $myObject["locations"][$i]["verticalAccuracy"];
        else
            $verticalAccuracy = "null";

        $timestampMs = gmdate('Y-m-d H:i:s',$myObject["locations"][$i]["timestampMs"]/1000);

        if (substr_count($myString, $timestampMs) > 0) 
            continue;
        
        $myString .= "('".$id."','".$timestampMs."',
        ".$myObject["locations"][$i]["accuracy"].",
        ".$myObject["locations"][$i]["latitudeE7"].",
        ".$myObject["locations"][$i]["longitudeE7"].",".$heading.",".$velocity.",".$altitude.",".$verticalAccuracy."),";

        if(isset($myObject["locations"][$i]["activity"])){
            for($j = 0; $j < count($myObject["locations"][$i]["activity"]); $j++){

                $subTimestampMs = gmdate('Y-m-d H:i:s',$myObject["locations"][$i]["activity"][$j]["timestampMs"]/1000);
                if (substr_count($myString2, $subTimestampMs) > 0) 
                    continue;

                $myString2 .= "('".$id."','".$timestampMs."','".$subTimestampMs."',";
    
                $confidence = 0;
                for($k = 0; $k < count($myObject["locations"][$i]["activity"][$j]["activity"]); $k++){
                    $tmp_confidence = $myObject["locations"][$i]["activity"][$j]["activity"][$k]["confidence"];
                    if($tmp_confidence > $confidence){
                        $type = $myObject["locations"][$i]["activity"][$j]["activity"][$k]["type"];
                        $confidence  = $myObject["locations"][$i]["activity"][$j]["activity"][$k]["confidence"];
                    }
                }
                $myString2 .= "'".$type."'),";
            }
        }
    }

/*     echo $myString;
    echo $myString2;

    //exit; */
    
    if($flag){
        $sql .= substr($myString, 0 ,-1).";";
        $sql2 .= substr($myString2, 0 ,-1).";";
        //$sql3 .= substr($myString3, 0 ,-1).";";  
        //echo(microtime(true)); 
        if ($conn->query($sql) === TRUE and $conn->query($sql2) === TRUE){ 
            $conn->query("UPDATE Users SET last_upload= ' ".gmdate('Y-m-d H:i:s')."' WHERE id='".$id."'"); 
            echo '<script language="javascript"> 
            alert("success"); 
            window.location.href=" ../templates/home.html?username='.$_POST['username'].'&id='.$id.'"; 
            </script>';  
        }
        else{ 
            echo "<br> Error: " . $sql . "<br>" . $conn->error;
            echo "<br> Error: " . $sql2 . "<br>" . $conn->error;
        }

    }
    else{
        echo '<script language="javascript"> 
            alert("No points inside Patra"); 
            window.location.href=" ../templates/home.html?username='.$_POST['username'].'&id='.$id.'"; 
            </script>';
    }

    /* if ($conn->query($sql3) === TRUE) 
        echo '<script language="javascript"> 
           alert("success"); 
           window.location.href=" ../templates/home.html?username='.$_POST['username'].'"; 

           </script>';
        }
    else 
        echo "<br> Error: " . $sql3 . "<br>" . $conn->error; */
 

    $conn->close();
}

function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius)
  {
    // convert from degrees to radians
    $latFrom = deg2rad($latitudeFrom);
    $lonFrom = deg2rad($longitudeFrom);
    $latTo = deg2rad($latitudeTo);
    $lonTo = deg2rad($longitudeTo);
  
    $latDelta = $latTo - $latFrom;
    $lonDelta = $lonTo - $lonFrom;
  
    $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
      cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
    return $angle * $earthRadius;
  }
