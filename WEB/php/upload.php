<?php
if(isset($_POST['username']))
    $username = $_POST['username'];

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

    $sql ="INSERT INTO Arxeio(user_id,timestampMs,accuracy,latitudeE7,longitudeE7) VALUES";
    $myString = "";

    for ($i = 0; $i < count($myObject["locations"]); $i++) {

        $myString .= "(1,'".$myObject["locations"][$i]["timestampMs"]."',
        ".$myObject["locations"][$i]["accuracy"].",
        ".$myObject["locations"][$i]["latitudeE7"].",
        ".$myObject["locations"][$i]["longitudeE7"].")"; 
        
        if($i < count($myObject["locations"]) - 1)
            $myString .= ",";
        else
            $myString .= ";";
        /* if ($conn->query($sql) === TRUE) {
            echo "<br> New record created successfully";
            } else {
            echo "<br> Error: " . $sql . "<br>" . $conn->error;
            }  */
    }
    $sql .= $myString;
    $conn->query($sql);

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
?>