<?php
include("config.php");
include("firebaseRDB.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $db = new firebaseRDB($databaseURL);

    $insert = $db->insert("film", [
        "title"     => $_POST['title'],
        "thumbnail" => $_POST['thumbnail'],
        "year"      => $_POST['year'],
        "rating"    => $_POST['rating']
    ]);

    if ($insert) {
      echo "<script>alert('Details added successfully'); window.location='index.php';</script>";
  } else {
      echo "<script>alert('Error adding details'); window.location='index.php';</script>";
  }
}
?>

<!doctype html>
<html lang="en">
   <head>
      <title>Title</title>
      <!-- Required meta tags -->
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      <!-- Bootstrap CSS v5.2.1 -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
   </head>

   <body>
      <header>
         <!-- place navbar here -->
      </header>
      <main>
         <form method="post" action="add.php">
            <table border="0" width="500">
               <tr>
                  <td>Title</td>
                  <td>:</td>
                  <td><input type="text" name="title"></td>
               </tr>
               <tr>
                  <td>Thumbnail</td>
                  <td>:</td>
                  <td><input type="text" name="thumbnail"></td>
               </tr>
               <tr>
                  <td>Year</td>
                  <td>:</td>
                  <td><input type="text" name="year"></td>
               </tr>
               <tr>
                  <td>Rating</td>
                  <td>:</td>
                  <td><input type="text" name="rating"></td>
               </tr>
               <tr>
                  <td><input type="submit" value="SAVE"></td>
               </tr>
            </table>
         </form>
      </main>
      <footer>
         <!-- place footer here -->
      </footer>
      <!-- Bootstrap JavaScript Libraries -->
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js" integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+" crossorigin="anonymous"></script>
   </body>
</html>
