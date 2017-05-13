<?php
session_start();

$servername = "localhost";
$username = "###";
$password = "###";
$dbname = "###";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);


switch ($_REQUEST["request"]) {
    case "login":
        $request_key = explode(",", $_REQUEST["key"]);
        $request_key_lenght = count($request_key);
        
        $sql = "SELECT id, pin, power FROM accounts";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc())
            {
                $key = $row["pin"];
                
                $i = 0;
                $key_lenght = strlen($key);
                $found = true;
                
                //echo "key" . $key . "   ";
                //echo "key_lenght" . $key_lenght . "   ";
                
                if ($request_key_lenght < $key_lenght)
                    continue;
                
                while ($i < $key_lenght)
                {
                    if ($request_key[$request_key_lenght - $i - 1] != $key[$key_lenght - $i - 1])
                    {
                        $found = false;
                        break;
                    }
            
                    $i++;
                }
        
                if ($found)
                {
                    $_SESSION["user_id"] = $row["id"];
                    $_SESSION["user"] = $key;
                    $_SESSION["power"] = $row["power"];
                    die("OK");
                }
        
            }

            die("NO_OK");

        } else {
            die("No accounts in database.");
        }

    case "logged":
        if (!$_SESSION["user_id"] || $_SESSION["user_id"] == "0")
        {
            $_SESSION["user_id"] = "0";
            $_SESSION["user"] = "0";
            $_SESSION["power"] = "20";
            die("NO_OK");
        }
        else
        {
            die("OK");
        }


    case "logout":
        $_SESSION["user_id"] = "0";
        $_SESSION["user"] = "0";
        $_SESSION["power"] = "20";

        die("OK");



    case "files":
        if ($_SESSION["power"] >= "20") {
            $repeat = "";
            foreach (glob("../files/*.*") as $filename) {
                $name = substr($filename, 9);
                $repeat .= "</>$name<:>" . filesize($filename) . "<:>" . date("Y-m-d", filemtime($filename));
            }
            die(substr($repeat, 3));
        } else {
            die("NO_LOGIN");
        }


    case "getFile":
        if ($_SESSION["power"] < "10") {
            die("NO_LOGIN");
        }

        if ($_SESSION["power"] >= "20") {
            $file = "../files" . "/" . $_REQUEST["fileName"];
            if (file_exists($file)) {

                if ($_REQUEST["prepare"] == "YES") {
                    die("OK");
                } else {
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename="'.$_REQUEST["fileName"].'"');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($file));
                    readfile($file);
                    die();
                }
            } else {
                die("NO_FILE");
            }

        } else {
            die("NO_PERMISSION");
        }


    case "delFile":
        if ($_SESSION["power"] < "10") {
            die("NO_LOGIN");
        }

        if ($_SESSION["power"] >= "50") {
            $file = "../files" . "/" . $_REQUEST["fileName"];
            if (file_exists($file)) {
                //chdir($_SERVER["DOCUMENT_ROOT"] . "/files" . "/");
                unlink($file);
                //die(error_get_last()["message"]);
                die("OK");
            } else {
                die("NO_FILE");
            }

        } else {
            die("NO_PERMISSION");
        }
    
    
    
    default:
        die("Unknow request. Die.");
}





/*

foreach (glob("files/*.*") as $filename) {
$name = substr($filename, 7);
$repeat .= "<;>$name<:>" . filesize($filename) . "<:>" . date("Y-m-d", filemtime($filename));
}
echo substr($repeat, 3);




$attachment_location = $_SERVER["DOCUMENT_ROOT"] . "/files/Zadania - statystyka.zip";
if (file_exists($attachment_location)) {

header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
header("Cache-Control: public"); // needed for internet explorer
header("Content-Type: application/zip");
header("Content-Transfer-Encoding: Binary");
header("Content-Length:".filesize($attachment_location));
header("Content-Disposition: attachment; filename=Zadania - statystyka.zip");
readfile($attachment_location);
die();
} else {
die("Error: File not found.");
}

die($repeat);
*/

?>