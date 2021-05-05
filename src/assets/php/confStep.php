<?php
require 'Connexion.php';

$con = new Connexion();

$sql = "UPDATE t_prod_suboperation_steps SET DATE_FIN = NOW() WHERE ID_PROD_STEP = :idProdStep";
$query = $con->createQuery($sql, [
    'idProdStep' => $_GET['idProdStep'],
]);

$sql="INSERT INTO t_prod_traca_user (ID_PROD_STEP,USER) VALUES (:idProdStep,:user)";
$query = $con->createQuery($sql, [
  'idProdStep' => $_GET['idProdStep'],
  'user'=> $_GET['user']
]);

$sql="SELECT * FROM t_prod_traca_user WHERE ID_PROD_STEP =:idProdStep";
$query = $con->createQuery($sql, [
  'idProdStep' => $_GET['idProdStep'],
]);
$users= $query->fetch();


$sql = "SELECT * FROM t_prod_suboperation_steps WHERE ID_PROD_STEP = :idProdStep";
$query = $con->createQuery($sql, [
    'idProdStep' => $_GET['idProdStep'],
]);
$prodSubOpStep = $query->fetch();
$prodSubOpStep['user']=$users;

echo json_encode($prodSubOpStep);
