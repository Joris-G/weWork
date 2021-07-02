<?php
require 'Connexion.php';
$con = new Connexion();


//Test si idProdTraca existe
$sql = "SELECT * FROM t_prod_traca WHERE ID_PROD_STEP = :idProdStep AND ID_TRACA = :idTraca";
$query = $con->createQuery($sql, [
  'idProdStep' => $_GET['idProdStep'],
  'idTraca' => $_GET['idTraca'],
]);
$idProdTraca = $query->fetch();
// var_dump($idProdTraca);

if (!$idProdTraca) {
  $sql = "INSERT INTO t_prod_traca (ID_PROD_STEP, ID_TRACA, DATE_TRACA, `SANCTION`)
VALUES (:idProdStep, :idTraca, NOW(), :sanction)";
  $query = $con->createQuery($sql, [
    'idProdStep' => $_GET['idProdStep'],
    'idTraca' => $_GET['idTraca'],
    'sanction' => $_GET['prodTracaDetailSanction']
  ]);
  $sql = "SELECT * FROM t_prod_traca WHERE ID_PROD_STEP = :idProdStep AND ID_TRACA = :idTraca";
  $query = $con->createQuery($sql, [
    'idProdStep' => $_GET['idProdStep'],
    'idTraca' => $_GET['idTraca'],
  ]);
  $idProdTraca = $query->fetch();
  // var_dump($idProdTraca);
}

switch ($_GET['tracaType']) {
  case 'controle':
    if ($_GET['idEcme'] != 'undefined') {
      $sql = "INSERT INTO t_prod_traca_controle (ID_PROD_TRACA,ID_TRACA_CONTROLE,ID_ECME,SANCTION,COMMENTAIRE,DATE_EXECUTION) VALUES (:idProdTraca, :idProdTracaControle, :idEcme, :sanction,:comment,NOW())";
      $query = $con->createQuery($sql, [
        'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],
        'idProdTracaControle' => $_GET['idTracaControle'],
        'idEcme' => $_GET['idEcme'],
        'sanction' => $_GET['prodTracaDetailSanction'],
        'comment' => $_GET['comment']
      ]);
    } else {
      $sql = "INSERT INTO t_prod_traca_controle (ID_PROD_TRACA,ID_TRACA_CONTROLE,SANCTION,COMMENTAIRE,DATE_EXECUTION)VALUES (:idProdTraca, :idProdTracaControle,:sanction,:comment,NOW())";
      $query = $con->createQuery($sql, [
        'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],
        'idProdTracaControle' => $_GET['idTracaControle'],
        'sanction' => $_GET['prodTracaDetailSanction'],
        'comment' => $_GET['comment']
      ]);
    }

    $sql = "SELECT * FROM t_prod_traca_controle WHERE ID_PROD_TRACA = :idProdTraca AND ID_TRACA_CONTROLE = :idProdTracaControle";
    $query = $con->createQuery($sql, [
      'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],
      'idProdTracaControle' => $_GET['idTracaControle'],
    ]);
    $prodTracaDetail = $query->fetch();

    $sql = "SELECT * FROM  t_ecme WHERE ID_ECME = :idEcme";
    $query = $con->createQuery($sql, ['idEcme' => $prodTracaDetail['ID_ECME']]);
    $ecme = $query->fetch();
    $prodTracaDetail['ECME'] = $ecme;
    break;
  case 'matiere':
    $sql = "INSERT INTO t_prod_traca_matiere (ID_PROD_TRACA,ID_TRACA_MATIERE,ID_MATIERE,SANCTION,COMMENTAIRE,DATE_EXECUTION)
        VALUES (:idProdTraca, :idProdTracaMatiere, :idMat, :sanction,:comment,NOW())";
    $query = $con->createQuery($sql, [
      'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],
      'idProdTracaMatiere' => $_GET['idTracaMatiere'],
      'idMat' => $_GET['idMat'],
      'sanction' => $_GET['sanction'],
      'comment' => $_GET['comment'],
    ]);

    $sql = "SELECT * FROM t_prod_traca_matiere WHERE ID_PROD_TRACA = :idProdTraca AND ID_TRACA_MATIERE = :idProdTracaMatiere";
    $query = $con->createQuery($sql, [
      'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],
      'idProdTracaMatiere' => $_GET['idTracaMatiere'],
    ]);
    $prodTracaDetail = $query->fetch();
    break;
  case 'of':
    $ofList = explode(',', $_GET['recordedOf']);
    // var_dump($ofList);
    foreach ($ofList as $key => $of) {
      $sql = "INSERT INTO t_prod_traca_of (ID_PROD_TRACA,ID_TRACA_OF,OF,SANCTION,COMMENTAIRE,DATE_EXECUTION)
        VALUES (:idProdTraca, :idTracaOf, :of, :sanction,:comment,NOW())";
      $query = $con->createQuery($sql, [
        'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],
        'idTracaOf' => $_GET['idTracaOf'],
        'of' => $of,
        'sanction' => $_GET['prodTracaDetailSanction'],
        'comment' => $_GET['comment'],
      ]);
    }
    $sql = "SELECT * FROM t_prod_traca_of WHERE ID_PROD_TRACA = :idProdTraca AND ID_TRACA_OF = :idTracaOf";
    $query = $con->createQuery($sql, [
      'idProdTraca' => $idProdTraca['ID_PROD_TRACA'],'idTracaOf' =>$_GET['idTracaOf'],
    ]);

    $prodTracaDetail = $query->fetch();

    $sql = "SELECT * FROM  t_prod_traca_of WHERE ID_PROD_TRACA = :idProdTraca AND ID_TRACA_OF = :idTracaOf";
    $query = $con->createQuery($sql, ['idProdTraca' => $idProdTraca['ID_PROD_TRACA'],'idTracaOf' =>$_GET['idTracaOf']]);
    $prodTracaDetail2 = $query->fetchAll();
    $listOF = [];
    foreach ($prodTracaDetail2 as $key => $inter) {
      array_push($listOF, $inter['OF']);
    }
    $prodTracaDetail['OF'] = $listOF;
    break;
  default:
    # code...
    break;
}

$result = array(
  'prodTraca' => $idProdTraca,
  'prodTracaDetail' => $prodTracaDetail
);
echo json_encode($result);
