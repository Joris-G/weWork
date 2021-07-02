<?php
require 'Connexion.php';

$con = new Connexion();

$sql = "UPDATE t_prod_suboperation_steps SET DATE_FIN = NOW() WHERE ID_PROD_STEP = :idProdStep";
$query = $con->createQuery($sql, [
    'idProdStep' => $_GET['idProdStep'],
]);

// $sql="INSERT INTO t_prod_traca_user (ID_PROD_STEP,USER) VALUES (:idProdStep,:user)";
// $query = $con->createQuery($sql, [
//   'idProdStep' => $_GET['idProdStep'],
//   'user'=> $_GET['user']
// ]);

// if($_GET['coUsers']){
  $coUsers = explode(',', $_GET['coUsers']);
  foreach ( $coUsers as $keyUser => $user) {
    $sql="INSERT INTO t_prod_traca_user (ID_PROD_STEP,USER) VALUES (:idProdStep,:user)";
$query = $con->createQuery($sql, [
  'idProdStep' => $_GET['idProdStep'],
  'user'=> $user
]);
  }
// }

$sql="SELECT * FROM t_prod_traca_user WHERE ID_PROD_STEP =:idProdStep";
$query = $con->createQuery($sql, [
  'idProdStep' => $_GET['idProdStep'],
]);
$users= $query->fetchAll();

foreach ($users as $keyUser => $userMatricule) {
  $sql = "SELECT * FROM t_user WHERE MATRICULE = :matricule";
  $query = $con->createQuery($sql, ['matricule' => $userMatricule['USER']]);
  $completeUser = $query->fetch();
  $users[$keyUser]['COMPLETE_USER'] = $completeUser;
}

$sql = "SELECT * FROM t_prod_suboperation_steps WHERE ID_PROD_STEP = :idProdStep";
$query = $con->createQuery($sql, [
    'idProdStep' => $_GET['idProdStep'],
]);
$prodSubOpStep = $query->fetch();
$prodSubOpStep['users']=$users;

echo json_encode($prodSubOpStep);
