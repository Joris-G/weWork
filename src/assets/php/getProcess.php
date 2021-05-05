<?php
require 'Connexion.php';
header('content-Type: application/json');
$con = new Connexion();


//Process
$sql = "SELECT * FROM t_process WHERE CODIF_PROCESS = :codifProcess AND INDICE_PROCESS = :indiceProcess";
$query = $con->createQuery($sql, ['codifProcess' => $_GET['codifProcess'], 'indiceProcess' => 0]);
$process = $query->fetch();

//Prod Process
// On charge le prodProcess
$sql = "SELECT * FROM t_prod_process WHERE ORDRE_FABRICATION = :workorder";
$query = $con->createQuery($sql, ['workorder' => $_GET['OF']]);
$prodProcess = $query->fetch();
$process['prodProcess'] = $prodProcess;


//Article
$sql = "SELECT * FROM t_article WHERE ARTICLE_SAP = :articleSap";
$query = $con->createQuery($sql, ['articleSap' => $process['ARTICLE_SAP']]);
$article = $query->fetch();
$result['ARTICLE'] = $article;

//Operations
// $sql = "SELECT * FROM t_process_operation WHERE ID_PROCESS = :idProcess";
// $query = $con->createQuery($sql, ['idProcess' => $process['ID_PROCESS']]);
// $operationList = $query->fetchAll();

// $process['LISTE_OPERATIONS'] = $operationList;




// foreach ($operationList as $keyOperation => $operation) {
// ProdOperation
//On charge les opérations liées au prodProcess
// $sql = "SELECT * FROM t_prod_operation WHERE ID_PROD_PROCESS = :idProdProcess AND ID_OPERATION = :idOperation";
// $query = $con->createQuery($sql, ['idProdProcess' => $prodProcess['ID_PROD_PROCESS'], 'idOperation' => $operation['ID_OPERATION']]);
// $prodOperation = $query->fetch();
// //On ajoute
// $process['LISTE_OPERATIONS'][$keyOperation]['prodOperation'] = $prodOperation;




//Group
$sql = "SELECT * FROM t_process_subope_groups WHERE ID_PROCESS = :idProcess";
$query = $con->createQuery($sql, ['idProcess' => $process['ID_PROCESS']]);
$listGroupOpe = $query->fetchAll();

$process['OPERATION_GROUP'] = $listGroupOpe;

foreach ($process['OPERATION_GROUP'] as $keyOperationGroup => $operationGroup) {

  //SubOperation
  $sql = "SELECT * FROM t_process_suboperations WHERE ID_GROUP = :groupId";
  $query = $con->createQuery($sql, ['groupId' => $operationGroup['ID_GROUP']]);
  $detailedOperationsList = $query->fetchAll();

  $process['OPERATION_GROUP'][$keyOperationGroup]['OPERATIONS_DETAILLEES'] = $detailedOperationsList;

  if ($detailedOperationsList) {
    foreach ($detailedOperationsList as $keyDetailedOperation => $detailedOperation) {

      //ProdSuboperation
      $sql = "SELECT * FROM t_prod_suboperations WHERE ID_PROD_PROCESS = :idProdProcess AND ID_PROCESS_SUBOPE = :detailedOperationId ";
       $query = $con->createQuery($sql, ['idProdProcess' => $prodProcess['ID_PROD_PROCESS'], 'detailedOperationId' => $detailedOperation['ID_SUB_OPERATION']]);
       $prodSubOperation = $query->fetch();
      //On ajoute
      $process['OPERATION_GROUP'][$keyOperationGroup]['OPERATIONS_DETAILLEES'][$keyDetailedOperation]['prodSubOperation'] = $prodSubOperation;


      //Steps
      $sql = "SELECT * FROM t_process_suboperation_steps WHERE ID_SUB_OPERATION = :detailedOperationId";
      $query = $con->createQuery($sql, ['detailedOperationId' => $detailedOperation['ID_SUB_OPERATION']]);
      $steps = $query->fetchAll();

      if ($steps) {
        foreach ($steps as $keyStep => $step) {

          $sql = "SELECT * FROM t_process_instructions WHERE ID_STEP = :idProcessStep";
          $query = $con->createQuery($sql, ['idProcessStep' => $step['ID_STEP']]);
          $instruction = $query->fetch();
          $step['INSTRUCTION'] = $instruction;

          $sql = "SELECT * FROM t_traca WHERE ID_STEP = :detailedOperationId";
          $query = $con->createQuery($sql, ['detailedOperationId' => $step['ID_STEP']]);
          $tracasList = $query->fetch();
          $tracaTypeTable;
          $prodTracaTypeTable;
          if ($tracasList) {

            switch ($tracasList['TYPE_TRACA']) {
              case '1':
                $tracaTypeTable = 't_traca_controle';
                $prodTracaTypeTable = 't_prod_traca_controle';
                $idTracaParam = 'ID_TRACA_CONTROLE';
                break;
              case '2':
                $tracaTypeTable = 't_traca_matiere';
                $prodTracaTypeTable = 't_prod_traca_matiere';
                $idTracaParam = 'ID_TRACA_MATIERE';
                break;
              case '3':
                $tracaTypeTable = 't_traca_of';
                $prodTracaTypeTable = 't_prod_traca_of';
                $idTracaParam = 'ID_TRACA_OF';
                break;
              case '4':
                $tracaTypeTable = 't_traca_mesure';
                $prodTracaTypeTable = 't_prod_traca_mesure';
                $idTracaParam = 'ID_TRACA_MESURE';
                break;
              default:
                # code...
                break;
            }
            $sql = "SELECT * FROM $tracaTypeTable WHERE ID_TRACA = :idTraca";
            $query = $con->createQuery($sql, ['idTraca' => $tracasList['ID_TRACA']]);
            $traca = $query->fetchAll();

            $tracasList['TRACA_DETAILS'] = $traca;

            $sql = "SELECT * FROM t_prod_traca WHERE ID_TRACA = :idTraca";
            $query = $con->createQuery($sql, ['idTraca' => $tracasList['ID_TRACA']]);
            $prodTraca = $query->fetch();
            //On ajoute
            $tracasList['prodTraca'] = $prodTraca;

            //Prod TracaDetails
            foreach ($traca as $keyTracaDet => $tracaDeta) {
              // var_dump($tracaDeta);
              $sql = "SELECT * FROM  $prodTracaTypeTable WHERE ID_PROD_TRACA = :idProdTraca AND $idTracaParam = :idTracaControle";
              $query = $con->createQuery($sql, ['idProdTraca' => $prodTraca['ID_PROD_TRACA'], 'idTracaControle' => $tracaDeta[$idTracaParam]]);
              $prodTracaDetail = $query->fetch();
              //On ajoute

              $tracasList['TRACA_DETAILS'][$keyTracaDet]['prodTracaDetail'] = $prodTracaDetail;


              if ($tracasList['TYPE_TRACA'] == 1) {
                if ($tracaDeta['ID_TYPE_ECME']) {
                  $sql = "SELECT TYPE_ECME FROM t_ecme_type WHERE ID_TYPE_ECME = :idType";
                  $query = $con->createQuery($sql, ['idType' => $tracaDeta['ID_TYPE_ECME']]);
                  $desECME = $query->fetch();
                  $tracasList['TRACA_DETAILS'][$keyTracaDet]['desECME'] = $desECME;
                }
              }
            }
            $step['TRACA'] = $tracasList;
          }
          $process['OPERATION_GROUP'][$keyOperationGroup]['OPERATIONS_DETAILLEES'][$keyDetailedOperation]['STEPS'][$keyStep] = $step;

          //ProdStep
          $sql = "SELECT * FROM t_prod_suboperation_steps WHERE ID_PROD_SUBOP = :idProdSubOperation AND ID_STEP = :idProcessStep";
          $query = $con->createQuery($sql, ['idProdSubOperation' => $prodSubOperation['ID_PROD_SUBOP'], 'idProcessStep' => $step['ID_STEP']]);
          $prodSubOperationStep = $query->fetch();

          if ($prodSubOperationStep) {
            //On charge les utilisateurs
            $sql = "SELECT * FROM t_prod_traca_user WHERE ID_PROD_STEP = :idProdStep";
            $query = $con->createQuery($sql, ['idProdStep' => $prodSubOperationStep['ID_PROD_STEP']]);
            $prodTracaUser = $query->fetch();
            //On ajoute
            if ($prodTracaUser) {
              $prodSubOperationStep['users'] = $prodTracaUser;
            }
          }
          //On ajoute
          $process['OPERATION_GROUP'][$keyOperationGroup]['OPERATIONS_DETAILLEES'][$keyDetailedOperation]['STEPS'][$keyStep]['prodStep'] = $prodSubOperationStep;
        }
      }
    }
  }
}
// }

$result['process'] = $process;
echo json_encode($result);
