<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['typeOperation']) {
  case 'getTool':
    $sql = "SELECT * FROM t_tools WHERE SAP_NUMBER = :sapNumber";
    $query = $con->createQuery($sql, [
      'sapNumber' => $_GET['sapNumber'],
    ]);
    $response = $query->fetch();
    break;
  case 'getToolsList':
    $sql = "SELECT * FROM t_tools";
    $query = $con->createQuery($sql, []);
    $response = $query->fetchAll();
    break;
  case 'getToolRequestList':
    $sql = "SELECT * FROM t_tooling_requests";
    $query = $con->createQuery($sql, []);
    $response = $query->fetchAll();
    break;

  case 'addTool':
    $sql = "INSERT INTO t_tools (SAP_NUMBER,DESIGNATION, 'VERSION') VALUES (:sapNumber, :designation, :release)";
    $query = $con->createQuery($sql, [
      'sapNumber' => $_GET['sapNumber'],
      'designation' => $_GET['designation'],
      'release' => $_GET['version']
    ]);
    $sql = "SELECT * FROM t_tools WHERE SAP_NUMBER = :sapNumber AND 'VERSION' =:release";
    $query = $con->createQuery($sql, [
      'sapNumber' => $_GET['sapNumber'],
      'release' => $_GET['version']
    ]);
    $response = $query->fetch();
    break;
  case 'addToolRequest':
    $sql = "INSERT INTO t_tooling_requests (ID_USER,	ID_TOOL,`DESCRIPTION`,DATE_BESOIN, `TYPE_DEMANDE`) VALUES (:requestor, :idTool,:descrip,:needDate,:requestType)";
    $query = $con->createQuery($sql, [
      'requestor' => $_GET['requestor'],
      'idTool' => $_GET['idTool'],
      'descrip' => $_GET['description'],
      'needDate' => $_GET['needDate'],
      'requestType' => $_GET['requestType'],
    ]);
    $sql = "SELECT * FROM t_tooling_requests WHERE ID_USER = :requestor AND `DESCRIPTION` =:descrip";
    $query = $con->createQuery($sql, [
      'requestor' => $_GET['requestor'],
      'descrip' => $_GET['description']
    ]);
    $response = $query->fetch();
    break;
  case 'updateRequestAffectation':
    $sql = "SELECT * FROM t_tooling_requests WHERE ID_TOOLING_REQUEST = :idRequest";
    $query = $con->createQuery($sql, [
      'idRequest' => $_GET['idRequest'],
    ]);
    $response = $query->fetch();
    if ($response['STATUT'] == 0) {
      $status = $response['STATUT'] + 1;
    } else {
      $status = $response['STATUT'];
    }

    $sql = "UPDATE t_tooling_requests SET GROUPE_AFFECTATION = :groupeAffectation, DATE_AFFECTATION = NOW(), STATUT = :statut WHERE ID_TOOLING_REQUEST =:idRequest";
    $query = $con->createQuery($sql, [
      'groupeAffectation' => $_GET['affectation'],
      'idRequest' => $_GET['idRequest'],
      'statut' => $status
    ]);

    $sql = "SELECT * FROM t_tooling_requests WHERE ID_TOOLING_REQUEST = :idRequest";
    $query = $con->createQuery($sql, [
      'idRequest' => $_GET['idRequest'],
    ]);
    $response = $query->fetch();
    break;

  default:
    # code...
    break;
}

echo json_encode($response);
