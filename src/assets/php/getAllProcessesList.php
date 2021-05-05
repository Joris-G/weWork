<?php
require 'Connexion.php';
header('content-Type: application/json');
$con = new Connexion();

$sql = "SELECT * FROM t_process";
$query = $con->createQuery($sql, []);
$processesList = $query->fetchAll();

echo json_encode($processesList);
