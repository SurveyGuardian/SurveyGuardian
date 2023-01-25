<?php

// fetch http post data from ajax
$surveyid = $_POST["surveyid"];
$userid = $_POST["userid"];
$manualid = $_POST["manualid"];
$proof = str_replace("\"", "", $_POST["proof"]);
$ac = $_POST["ac"];
$bd = $_POST["bd"];

// generate csv file structure
$filepath = "survey-tables/".$surveyid.".csv";
$data = array($userid, $manualid, $bd, $ac, $proof, substr_count($proof, ',')+1);
$header = array("LSID", "MANUALID", "BD VIOLATION", "AC VIOLATION", "PROOF", "FAILURES");

$fileexists = (file_exists($filepath)) ? true : false;

// open csv file for writing
$f = fopen($filepath, 'a');
if ($f === false) {
   die('Error opening the file ' . $filepath);
}

// if file doesn't exist, add header, else, don't
if (!$fileexists) {
   $datarow = [["sep=,"], $header, $data];
} else {
   $datarow = [$data];
}

// write data to file
try {
   foreach ($datarow as $field) {
      fputcsv($f, $field);
   }
} catch (Exception $e) {
   return $e;
}



// close the file
fclose($f);

return 0;

?>