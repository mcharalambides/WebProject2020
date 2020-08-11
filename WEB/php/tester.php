<?php

$command = escapeshellcmd('index.py');
echo $command;
$output = shell_exec($command);
echo $output;

?>
