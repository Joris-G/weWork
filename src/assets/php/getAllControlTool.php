<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ecme";
$query = $con->createQuery($sql, );
$toolList = $query->fetchAll();
foreach ($toolList as $key => $tool) {
  $sql = "SELECT TYPE_ECME FROM t_ecme_type WHERE ID_TYPE_ECME = :idTypeECME";
$query = $con->createQuery($sql,['idTypeECME'=> $tool['ID_TYPE_ECME']] );
$toolList[$key] += $query->fetch();
}
echo(json_encode($toolList));
