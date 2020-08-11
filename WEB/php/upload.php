<?php

if(isset($_POST['submit'])){
    $file = $_FILES['upload'];//To arxeio
    $fileName = $_FILES['upload']['name'];//Pairnoume to onoma tou arxeiou
    $fileTmpName = $_FILES['upload']['tmp_name'];

    //Pairnoume to extension
    $fileExt = explode('.', $fileName);
    $fileActualExt = end($fileExt);

    //Elegxoume oti einai json
    if(strcmp('json', $fileActualExt) == 0){
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
    }
}
?>