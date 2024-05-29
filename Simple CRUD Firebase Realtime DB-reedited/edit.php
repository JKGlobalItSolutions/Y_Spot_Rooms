<?php
include("config.php");
include("firebaseRDB.php");

$db = new firebaseRDB($databaseURL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $update = $db->update("film", $id, [
       "title"     => $_POST['title'],
       "thumbnail" => $_POST['thumbnail'],
       "year"      => $_POST['year'],
       "rating"    => $_POST['rating']
    ]);
    
    if ($update) {
        echo "<script>alert('Details updated successfully'); window.location='index.php';</script>";
    } else {
        echo "<script>alert('Error updating details'); window.location='index.php';</script>";
    }
    exit();
} else {
    $id = $_GET['id'];
    $retrieve = $db->retrieve("film/$id");
    $data = json_decode($retrieve, true);
?>
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
       <table width="500">
          <tr>
             <td>Title</td>
             <td>:</td>
             <td><input type="text" name="title" value="<?php echo $data['title']?>"></td>
          </tr>
          <tr>
             <td>Thumbnail</td>
             <td>:</td>
             <td><input type="text" name="thumbnail" value="<?php echo $data['thumbnail']?>"></td>
          </tr>
          <tr>
             <td>Year</td>
             <td>:</td>
             <td><input type="text" name="year" value="<?php echo $data['year']?>"></td>
          </tr>
          <tr>
             <td>Rating</td>
             <td>:</td>
             <td><input type="text" name="rating" value="<?php echo $data['rating']?>"></td>
          </tr>
          <tr>
             <td>
                <input type="hidden" name="id" value="<?php echo $id?>">
                <input type="submit" value="SAVE">
             </td>
          </tr>
       </table>
    </form>
<?php
}
?>
