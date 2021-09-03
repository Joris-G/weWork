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

$sql = "SELECT * FROM t_prod_workorder WHERE WORKORDER = :workorder";
$query = $con->createQuery($sql, ['workorder' => $_GET['OF']]);
$prodWo = $query->fetch();
$process['prodProcess']['boxName'] = $prodWo['PRENOM_PIECE'];

//Article
$sql = "SELECT * FROM t_article WHERE ARTICLE_SAP = :articleSap";
$query = $con->createQuery($sql, ['articleSap' => $process['ARTICLE_SAP']]);
$article = $query->fetch();
$result['ARTICLE'] = $article;

//Group
$sql = "SELECT * FROM t_process_subope_groups WHERE ID_PROCESS = :idProcess ORDER BY ORDRE";
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

          //ProdStep
          $sql = "SELECT * FROM t_prod_suboperation_steps WHERE ID_PROD_SUBOP = :idProdSubOperation AND ID_STEP = :idProcessStep";
          $query = $con->createQuery($sql, ['idProdSubOperation' => $prodSubOperation['ID_PROD_SUBOP'], 'idProcessStep' => $step['ID_STEP']]);
          $prodSubOperationStep = $query->fetch();

          if ($prodSubOperationStep) {
            //On charge les utilisateurs
            $sql = "SELECT * FROM t_prod_traca_user WHERE ID_PROD_STEP = :idProdStep";
            $query = $con->createQuery($sql, ['idProdStep' => $prodSubOperationStep['ID_PROD_STEP']]);
            $prodTracaUser = $query->fetchAll();
            //Si résultat On ajoute l'utilisateur complet
            if ($prodTracaUser) {

              foreach ($prodTracaUser as $keyUser => $userMatricule) {
                $sql = "SELECT * FROM t_user WHERE ID_UTILISATEUR = :idUser";
                $query = $con->createQuery($sql, ['idUser' => $userMatricule['USER']]);
                $completeUser = $query->fetch();
                $prodTracaUser[$keyUser]['COMPLETE_USER'] = $completeUser;
              }

              $prodSubOperationStep['users'] = $prodTracaUser;
            }
          }

          $sql = "SELECT * FROM t_traca WHERE ID_STEP = :detailedOperationId";
          $query = $con->createQuery($sql, ['detailedOperationId' => $step['ID_STEP']]);
          $tracasList = $query->fetchAll();


          if ($tracasList) {




            foreach ($tracasList as $keyTraca => $tracas) {


              $tracaTypeTable;
              $prodTracaTypeTable;
              if ($tracas) {

                switch ($tracas['TYPE_TRACA']) {
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
                $query = $con->createQuery($sql, ['idTraca' => $tracas['ID_TRACA']]);
                $traca = $query->fetchAll();

                $tracas['TRACA_DETAILS'] = $traca;

                $sql = "SELECT * FROM t_prod_traca WHERE ID_TRACA = :idTraca AND ID_PROD_STEP = :idProdStep";
                $query = $con->createQuery($sql, ['idTraca' => $tracas['ID_TRACA'], 'idProdStep' => $prodSubOperationStep['ID_PROD_STEP']]);
                $prodTraca = $query->fetch();
                //On ajoute
                $tracas['prodTraca'] = $prodTraca;

                //Prod TracaDetails
                foreach ($traca as $keyTracaDet => $tracaDeta) {
                  // var_dump($tracaDeta);

                  $sql = "SELECT * FROM  $prodTracaTypeTable WHERE ID_PROD_TRACA = :idProdTraca AND $idTracaParam = :idTracaParam";
                  $query = $con->createQuery($sql, ['idProdTraca' => $prodTraca['ID_PROD_TRACA'],'idTracaParam'=> $tracaDeta[$idTracaParam]]);
                  $prodTracaDetail = $query->fetch();

                  if ($tracas['TYPE_TRACA'] == '3') {
                    $sql = "SELECT * FROM  $prodTracaTypeTable WHERE ID_PROD_TRACA = :idProdTraca AND ID_TRACA_OF = :idTracaOf";
                    $query = $con->createQuery($sql, ['idProdTraca' => $prodTraca['ID_PROD_TRACA'], 'idTracaOf' =>  $tracaDeta['ID_TRACA_OF']]);
                    $prodTracaDetail2 = $query->fetchAll();
                    $listOF = [];
                    foreach ($prodTracaDetail2 as $key => $inter) {
                      array_push($listOF, $inter['OF']);
                    }
                    $prodTracaDetail['OF'] = $listOF;
                  }//
                    // foreach ($tracaDetailsInter as $key => $inter) {
                    //   array_push($listOF,$inter['OF']);
                    // }
                    // $prodTracaDetail['OF'] = $listOF;

                    //On ajoute

                    if ($tracas['TYPE_TRACA'] == '1') {
                      // On cherche le numéro de commacola
                      $sql = "SELECT * FROM  t_ecme WHERE ID_ECME = :idEcme";
                      $query = $con->createQuery($sql, ['idEcme' => $prodTracaDetail['ID_ECME']]);
                      $ecme = $query->fetch();
                      $prodTracaDetail['ECME'] = $ecme;
                    }
                    if ($tracas['TYPE_TRACA'] == '2') {
                      // On cherche le numéro de lot
                      $sql = "SELECT * FROM  t_materials_entry WHERE ID_MAT = :idMat";
                      $query = $con->createQuery($sql, ['idMat' => $prodTracaDetail['ID_MATIERE']]);
                      $materialDetails = $query->fetch();
                      $prodTracaDetail['MAT'] = $materialDetails;

                      $sql = "SELECT * FROM  t_materials WHERE ID_MATIERE = :idMat";
                      $query = $con->createQuery($sql, ['idMat' => $tracaDeta['ARTICLE']]);
                      $materialInfo = $query->fetch();
                      $tracas['TRACA_DETAILS'][$keyTracaDet]['matInfo'] = $materialInfo;
                    }
                    $tracas['TRACA_DETAILS'][$keyTracaDet]['prodTracaDetail'] = $prodTracaDetail;

                    if ($tracas['TYPE_TRACA'] == '1') {
                      if ($tracaDeta['ID_TYPE_ECME']) {
                        $sql = "SELECT TYPE_ECME FROM t_ecme_type WHERE ID_TYPE_ECME = :idType";
                        $query = $con->createQuery($sql, ['idType' => $tracaDeta['ID_TYPE_ECME']]);
                        $desECME = $query->fetch();
                        $tracas['TRACA_DETAILS'][$keyTracaDet]['desECME'] = $desECME;
                      }
                    }
                    if ($tracas['TYPE_TRACA'] == '3') {

                      $sql = "SELECT * FROM t_nom WHERE Article = :article";
                      $query = $con->createQuery($sql, ['article' => $tracaDeta['ARTICLE']]);
                      $detArticle = $query->fetch();
                      $tracas['TRACA_DETAILS'][$keyTracaDet]['DETAIL_ARTICLE'] = $detArticle;
                    }
                  }
                  $tracasList[$keyTraca] = $tracas;
                }
              }
              $step['TRACAS'] = $tracasList;
            }

            $process['OPERATION_GROUP'][$keyOperationGroup]['OPERATIONS_DETAILLEES'][$keyDetailedOperation]['STEPS'][$keyStep] = $step;




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
