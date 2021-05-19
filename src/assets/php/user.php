<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['typeOperation']) {
  case 'usersList':
  switch ($_GET['role']) {
    case 'null':
    $sql = "SELECT * FROM t_user";
    $query = $con->createQuery($sql, []);
      break;

    default:
    $sql = "SELECT * FROM t_user WHERE `ROLE` = :idRole";
    $query = $con->createQuery($sql, [
      'idRole'=> $_GET['role']
    ]);
      break;
  }

        $response = $query->fetchAll();
        break;

    default:
        # code...
        break;
}

echo json_encode($response);
