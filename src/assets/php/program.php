<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['typeOperation']) {
  case 'getAllPrograms':
    $sql = "SELECT * FROM t_program";
    $query = $con->createQuery($sql, []);
    $response = $query->fetchAll();
    break;

  case 'getProgramById':
    $sql = "SELECT * FROM t_program WHERE ID_PROGRAM = :idProgram";
    $query = $con->createQuery($sql, [
      'idProgram' => $_GET['idProgram'],
    ]);
    $response = $query->fetch();
    break;


  default:
    # code...
    break;
}

echo json_encode($response);
