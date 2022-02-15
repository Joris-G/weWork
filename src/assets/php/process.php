<?php
require 'Connexion.php';
$con = new Connexion();

$sql = "SELECT * FROM  `t_process` WHERE `CODIF_PROCESS` = :codifProcess";

$query = $con->createQuery($sql, ['codifProcess' => $_GET['codifProcess']]);
$result = $query->fetch();



echo json_encode($result);
