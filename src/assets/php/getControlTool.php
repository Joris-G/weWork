<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ecme WHERE ID_ECME = :idECME";
$query = $con->createQuery($sql,['idECME'=> $_GET['idECME']] );
$materialList = $query->fetch();

echo(json_encode($materialList));
