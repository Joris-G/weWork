<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['typeOperation']) {

  case 'getToolBySapNumber':
    $sql = "SELECT * FROM t_tools WHERE SAP_NUMBER = :sapNumber";
    $query = $con->createQuery($sql, [
      'sapNumber' => $_GET['sapNumber'],
    ]);

    $tool = $query->fetch();

    $sql = "SELECT * FROM t_program WHERE ID_PROGRAM = :idProgram";
    $query = $con->createQuery($sql, [
      'idProgram' => $tool['ID_PROGRAMME_AVION'],
    ]);
    $aircraftProgram = $query->fetch();
    $tool['AIRCRAFT_PROGRAM'] = $aircraftProgram;

    $response = $tool;
    break;

  case 'getToolById':
    $sql = "SELECT * FROM t_tools WHERE ID_TOOL = :idTool";
    $query = $con->createQuery($sql, [
      'idTool' => $_GET['idTool'],
    ]);
    $tool = $query->fetch();

    $sql = "SELECT * FROM t_program WHERE ID_PROGRAM = :idProgram";
    $query = $con->createQuery($sql, [
      'idProgram' => $tool['ID_PROGRAMME_AVION'],
    ]);
    $aircraftProgram = $query->fetch();
    $tool['AIRCRAFT_PROGRAM'] = $aircraftProgram;

    $response = $tool;


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
    foreach ($response as $key => $toolRequest) {
      $sql = "SELECT * FROM t_tools WHERE ID_TOOL = :idTool";
      $query = $con->createQuery($sql, [
        'idTool' => $toolRequest['ID_TOOL'],
      ]);
      $tool = $query->fetch();
      $sql = "SELECT * FROM t_program WHERE ID_PROGRAM = :idProgram";
      $query = $con->createQuery($sql, [
        'idProgram' => $tool['ID_PROGRAMME_AVION'],
      ]);
      $aircraftProgram = $query->fetch();
      $tool['AIRCRAFT_PROGRAM'] = $aircraftProgram;

      $response[$key]['ID_TOOL']=$tool;
    }
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
    $request = json_decode($_GET['request'], true);

    // var_dump(date_create($request["dateBesoin"]));
    $sql = "INSERT INTO t_tooling_requests (`ID_USER`,`ID_TOOL`,`DESCRIPTION`,`DATE_BESOIN`, `TYPE_DEMANDE`,`AFFECTE_A`) VALUES (:demandeur, :idTool,:descrip,:needDate,:requestType,:affectedTo)";
    $query = $con->createQuery($sql, [
      'demandeur' => $request["requestor"]["idUser"],
      'idTool' => $request["tool"]["idTool"],
      'descrip' => $request["requestDescription"],
      'needDate' => $request["requestDate"],
      'requestType' => $request["type"],
      'affectedTo' => $request["affectedTo"]["idUser"],
    ]);
    $sql = "SELECT * FROM t_tooling_requests WHERE ID_USER = :demandeur AND `DESCRIPTION` = :descrip";
    $query = $con->createQuery($sql, [
      'demandeur' => $request["requestor"]["idUser"],
      'descrip' => $request["requestDescription"],
    ]);
    $response = $query->fetch();
    break;


  case 'updateRequest':
    $request = json_decode($_GET['request'], true);
    $sql = "UPDATE t_tooling_requests SET `DATE_DEMANDE`= :requestDate,`TYPE_DEMANDE`= :requestType,`ID_USER`= :userId,`ID_TOOL`= :toolId,`DESCRIPTION`= :descr,`DATE_BESOIN`= :needDate,`AFFECTE_A`= :affectedTo,`STATUT`= :requestStatus,`DATE_REALISATION`= NOW() , `NOTE_TOOLING`=:toolingCom,`REAL_USER_ID`=:realUser WHERE ID_TOOLING_REQUEST = :idRequest";
    $query = $con->createQuery($sql, [
      'idRequest' => $request["idToolRequest"],
      'requestDate' => $request["requestDate"],
      'requestType' => $request["type"],
      'userId' => $request["demandeur"]['value'],
      'toolId' => $request["toolNumber"],
      'descr' => $request["description"],
      'needDate' => $request["dateBesoin"],
      'affectedTo' => $request["affectedTo"],
      //  'affectationDate' => request.id,
      //  'planDate' => request.id,
      'requestStatus' => $request["statut"]["value"],
      // 'endDate' => $request["dateExecution"],
      'realUser' => $request["realUser"],
      'toolingCom' => $request['toolingCom'],
    ]);

    $sql = "SELECT * FROM t_tooling_requests WHERE ID_TOOLING_REQUEST = :idRequest";
    $query = $con->createQuery($sql, [
      'idRequest' => $request["id"],
    ]);
    $response = $query->fetch();
    break;

  default:
    # code...
    break;
}

echo json_encode($response);
