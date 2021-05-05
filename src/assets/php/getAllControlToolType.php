<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_ecme_type";
$query = $con->createQuery($sql,[] );
$toolTypeList = $query->fetchAll();

echo(json_encode($toolTypeList));
