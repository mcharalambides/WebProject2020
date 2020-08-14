<?php

if(isset($_POST['username']))
    $username = $_POST['username'];
if(isset($_POST['id']))
    $id = $_POST['id'];

if(isset($_POST['submit'])){
    $file = $_FILES['upload'];//To arxeio
    $fileName = $_FILES['upload']['name'];//Pairnoume to onoma tou arxeiou
    $fileTmpName = $_FILES['upload']['tmp_name'];

    //Pairnoume to extension
    $fileExt = explode('.', $fileName);
    $fileActualExt = end($fileExt);

    $myfile = fopen($fileTmpName, "r") or die("Unable to open file!");
    $myObject = json_decode(fread($myfile, filesize($fileTmpName)), true);

    $conn = new mysqli("127.0.0.1","root","", "Project2020");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
      }

      $sql ="INSERT INTO Arxeio(user_id,timestampMs,accuracy,latitudeE7,longitudeE7) VALUES ";
      $myString = "";
      $sql2 ="INSERT INTO Activity(user_id,timestampMs,subTimestampMs,type) VALUES ";
      $myString2 = "";  
        /* $sql3 ="INSERT INTO ActivityType(user_id,timestampMs,subTimestampMs,Type) VALUES ";
        $myString3 = ""; */

    $flag = false;  
    for ($i = 0; $i < count($myObject["locations"]); $i++) {
        
        //CALCULATE DISTANCE FROM CENTER OF PATRAS
        if(10 < haversineGreatCircleDistance(38.230462, 21.753150, $myObject["locations"][$i]["latitudeE7"]/ 10000000 , $myObject["locations"][$i]["longitudeE7"]/ 10000000, 6371))
            continue;
        $flag = true;

        $timestampMs = gmdate('Y-m-d H:i:s',$myObject["locations"][$i]["timestampMs"]/1000);
        $myString .= "('".$id."','".$timestampMs."',
        ".$myObject["locations"][$i]["accuracy"].",
        ".$myObject["locations"][$i]["latitudeE7"].",
        ".$myObject["locations"][$i]["longitudeE7"]."),"; 

        if(isset($myObject["locations"][$i]["activity"])){
            for($j = 0; $j < count($myObject["locations"][$i]["activity"]); $j++){

                $subTimestampMs = gmdate('Y-m-d H:i:s',$myObject["locations"][$i]["activity"][$j]["timestampMs"]/1000);
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

    if($flag){
        $sql .= substr($myString, 0 ,-1).";";
        $sql2 .= substr($myString2, 0 ,-1).";";
    //$sql3 .= substr($myString3, 0 ,-1).";";

        if ($conn->query($sql) === TRUE) 
            echo "<br>New record created successfully";
        else 
            echo "<br> Error: " . $sql . "<br>" . $conn->error;

        if ($conn->query($sql2) === TRUE) 
            echo "<br>New record created successfully";
        else 
            echo "<br> Error: " . $sql2 . "<br>" . $conn->error;

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

    //Elegxoume oti einai json
    /* if(strcmp('json', $fileActualExt) == 0){
        if(move_uploaded_file($fileTmpName, '../upload/'.$_POST['username'].'.json')){
           echo '<script language="javascript"> 
           alert("success"); 
           window.location.href=" ../templates/home.html?username='.$_POST['username'].'"; 

           </script>';
        }
        else
           echo '<script language="javascript"> alert("failure") </script>';
    }
    else{
        echo '<script language="javascript"> alert("You cannot upload files of this type!")
        window.location.href=" ../templates/home.html?username='.$_POST['username'].'";
         </script>'; 
    } */
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

?>