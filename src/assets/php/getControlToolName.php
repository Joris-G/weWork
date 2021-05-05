<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ecme_type WHERE ID_TYPE_ECME = :idTypeECME";
$query = $con->createQuery($sql,['idTypeECME'=> $_GET['idTypeECME']] );
$materialList = $query->fetch();

echo(json_encode($materialList));
