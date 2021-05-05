<?php
require 'Connexion.php';
$con = new Connexion();

$sql = "UPDATE t_prod_suboperations SET DATE_FIN = NOW() WHERE ID_PROD_SUBOP = :idProdSubOpe";
$query = $con->createQuery($sql, [
    'idProdSubOpe' => $_GET['idProdSubOpe'],
]);

$sql = "SELECT * FROM t_prod_suboperations WHERE ID_PROD_SUBOP = :idProdSubOpe";
$query = $con->createQuery($sql, [
    'idProdSubOpe' => $_GET['idProdSubOpe'],
]);
$return = $query->fetch();
echo json_encode($return);
