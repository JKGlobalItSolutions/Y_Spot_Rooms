<?php
include("config.php");
include("firebaseRDB.php");

$db = new firebaseRDB($databaseURL);
$id = $_GET['id'];
if($id != ""){
   $delete = $db->delete("film", $id);
   if ($delete) {
       echo "<script>alert('Data deleted successfully'); window.location='index.php';</script>";
   } else {
       echo "<script>alert('Error deleting data'); window.location='index.php';</script>";
   }
}
?>
