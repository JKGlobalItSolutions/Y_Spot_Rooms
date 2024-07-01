
<?php
include("config.php");
include("firebaseRDB.php");

$db = new firebaseRDB($databaseURL);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Firebase RDB CRUD</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .card-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        .card {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 300px;
        }
        .card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .card-body {
            padding: 16px;
        }
        .card-title {
            font-size: 1.25rem;
            margin: 0 0 8px 0;
        }
        .card-text {
            color: #666;
            margin: 0 0 16px 0;
        }
        .card-actions {
            display: flex;
            justify-content: space-between;
        }
        .btn {
            background-color: red;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>
<body>

<a href="add.php"><button class="btn">ADD DATA</button></a><br><br>

<div class="card-container">
    <?php
    $data = $db->retrieve("film");
    $data = json_decode($data, true);

    if (is_array($data)) {
        foreach ($data as $id => $film) {
            echo "
            <div class='card'>
                <img src='{$film['thumbnail']}' alt='{$film['title']}'>
                <div class='card-body'>
                    <h5 class='card-title'>{$film['title']}</h5>
                    <p class='card-text'>Year: {$film['year']}</p>
                    <p class='card-text'>Rating: {$film['rating']}</p>
                    <div class='card-actions'>
                        <a href='edit.php?id=$id'><button class='btn'>EDIT</button></a>
                        <a href='delete.php?id=$id'><button class='btn'>DELETE</button></a>
                    </div>
                </div>
            </div>";
        }
    }
    ?>
</div>

</body>
</html>
