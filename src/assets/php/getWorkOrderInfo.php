<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_prod_workorder WHERE WORKORDER = :workorder";
$query = $con->createQuery($sql, ['workorder' => $_GET['workorder']]);
$workorderInfo = $query->fetch();

if($workorderInfo){
  $sql = "SELECT * FROM t_nom WHERE Article = :articleSap";
$query = $con->createQuery($sql, ['articleSap' => $workorderInfo['NOM_ARTICLE']]);
$articleInfo = $query->fetch();
}
$info['workorderInfo'] = $workorderInfo;
$info['articleInfo'] = $articleInfo;

echo json_encode($info);
