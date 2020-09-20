<?php

$link = mysqli_connect("127.0.0.1", "root", "", "Project2020", "3307");

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

if (isset($_GET["action"]))
    $action = ($_GET["action"]);
else
    $action = null;

$data = json_decode(file_get_contents("php://input"));

if ($action == "Home") {

    //GET ACTIVITIES 
    $button1 = mysqli_query($link, "SELECT type AS category,COUNT(*) AS points FROM `Activity` GROUP BY type");
    $button1 = $button1->fetch_all(MYSQLI_ASSOC);

    //NUMBER OF RECORDS PER USER
    $button2 = mysqli_query($link, "SELECT username AS category,COUNT(*) AS points FROM `Arxeio` inner join Users on id = user_id group by user_id ORDER BY points DESC");
    $button2 = $button2->fetch_all(MYSQLI_ASSOC);

    //NUMBER OF RECORDS PER MONTH 
    $button3 = mysqli_query($link, "SELECT month(timestampMs) AS category,COUNT(*) AS points FROM `Arxeio` GROUP BY month(timestampMs)");
    $button3 = $button3->fetch_all(MYSQLI_ASSOC);

    //NUMBER OF RECORDS PER DAY OF THE WEEK
    $button4 = mysqli_query($link, "SELECT dayofweek(timestampMs) AS category,COUNT(*) AS points FROM `Arxeio` GROUP BY dayofweek(timestampMs)");
    $button4 = $button4->fetch_all(MYSQLI_ASSOC);

    //NUMBER OF RECORDS PER HOUR
    $button5 = mysqli_query($link, "SELECT hour(timestampMs) AS category,COUNT(*) AS points FROM `Arxeio` GROUP BY hour(timestampMs)");
    $button5 = $button5->fetch_all(MYSQLI_ASSOC);

    //NUMBER OF RECORDS PER YEAR
    $button6 = mysqli_query($link, "SELECT year(timestampMs) AS category,COUNT(*) AS points FROM `Arxeio` GROUP BY year(timestampMs)");
    $button6 = $button6->fetch_all(MYSQLI_ASSOC);

    $response["but1"] = $button1;
    $response["but2"] = $button2;
    $response["but3"] = $button3;
    $response["but4"] = $button4;
    $response["but5"] = $button5;
    $response["but6"] = $button6;
    echo json_encode($response);
} else if ($action == "Query") {
    //Getting new coordinates
    //echo $_GET["Query"];
    $coords = mysqli_query($link, $_GET["Query"]);
    $coords = $coords->fetch_all(MYSQLI_ASSOC);

    //Getting hours
    $response["coords"] = $coords;
    echo json_encode($response);
} else if ($action == "Delete") {
    //Getting delete queries
    $query1 = mysqli_query($link, $_GET["Query1"]);
    $query2 = mysqli_query($link, $_GET["Query2"]);

    echo "DATA HAS BEEN DELETED";
} else if ($action == "json") {
    //Getting delete queries
    $query = mysqli_query($link, $_GET["query"]);
    $query = $query->fetch_all(MYSQLI_ASSOC);
    $query = json_encode($query);

    $fname = 'webp-' . date('d-m-Y') . '.json';

    header('Content-Type: application/json');
    header('Content-Disposition: attachment; filename=' . basename($fname));
    header('Expires: 0'); //No caching allowed
    header('Cache-Control: must-revalidate');
    header('Content-Length: ' . strlen($query));
    file_put_contents('php://output', $query);
} else if ($action == "csv") {
    //Getting delete queries
    $query = mysqli_query($link, $_GET["query"]);

    $fname = 'webp-' . date('d-m-Y') . '.csv';

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=' . basename($fname));
    header('Expires: 0'); //No caching allowed
    header('Cache-Control: must-revalidate');
    $output = fopen("php://output", "w");
    fputcsv($output, array('timestampMs', 'heading', 'velocity', 'accuracy', 'altitude', 'latitudeE7', 'longitudeE7', 'verticalAccuracy', 'user_id', 'type'));
    while ($row = mysqli_fetch_assoc($query))
        fputcsv($output, $row);
    fclose($output);
} else if ($action == "xml") {
    //Getting delete queries
    $query = mysqli_query($link, $_GET["query"]);
    $query = $query->fetch_all(MYSQLI_ASSOC);

    $fname = 'webp-' . date('d-m-Y') . '.xml';

    header('Content-Type: text/xml; charset=utf-8');
    header('Content-Disposition: attachment; filename=' . basename($fname));
    header('Expires: 0'); //No caching allowed
    header('Cache-Control: must-revalidate');
    header('Content-Length: ' . strlen(json_encode($query)));

    echo arrayToXml($query);

    file_put_contents('php://output', $xml_data);
}

function arrayToXml($array, $rootElement = null, $xml = null)
{
    $_xml = $xml;

    // If there is no Root Element then insert root 
    if ($_xml === null) {
        $_xml = new SimpleXMLElement($rootElement !== null ? $rootElement : '<root/>');
    }

    // Visit all key value pair 
    foreach ($array as $k => $v) {

        // If there is nested array then 
        if (is_array($v)) {

            // Call function for nested array 
            arrayToXml($v, $k, $_xml->addChild($k));
        } else {

            // Simply add child element.  
            $_xml->addChild($k, $v);
        }
    }

    return $_xml->asXML();
}

mysqli_close($link);
