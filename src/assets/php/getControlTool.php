<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ecme WHERE ID_ECME = :idECME AND ID_TYPE_ECME = :idTypeECME";
$query = $con->createQuery($sql,['idECME'=> $_GET['idECME'], 'idTypeECME' => $_GET['idTypeECME']] );
$tool = $query->fetch();
if($tool){
$sql = "SELECT * FROM t_ecme_type WHERE ID_TYPE_ECME = :idTypeECME";
$query = $con->createQuery($sql,['idTypeECME' => $_GET['idTypeECME']] );
$typeTool = $query->fetch();
$tool['TYPE_TOOL'] = $typeTool;
}
echo(json_encode($tool));
