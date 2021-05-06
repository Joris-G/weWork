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
        case 'getToolRequestList':
        $sql = "SELECT * FROM t_tooling_requests";
        $query = $con->createQuery($sql, [

        ]);
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
        $sql = "INSERT INTO t_tooling_requests (DATE_DEMANDE,	ID_USER,	ID_TOOL,`DESCRIPTION`,	DATE_BESOIN) VALUES (NOW(), :requestor, :idTool,:descrip,:needDate)";
        $query = $con->createQuery($sql, [
            'requestor' => $_GET['requestor'],
            'idTool' => $_GET['idTool'],
            'descrip' => $_GET['description'],
            'needDate' => $_GET['needDate'],
        ]);
        $sql = "SELECT * FROM t_tooling_requests WHERE ID_USER = :requestor AND `DESCRIPTION` =:descrip";
        $query = $con->createQuery($sql, [
            'requestor' => $_GET['requestor'],
            'descrip' => $_GET['description']
        ]);
        $response = $query->fetch();
        break;
    default:
        # code...
        break;
}

echo json_encode($response);
