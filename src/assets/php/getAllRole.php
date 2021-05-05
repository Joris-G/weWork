<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_role";
$query = $con->createQuery($sql,);
$roleList = $query->fetchAll();

echo (json_encode($roleList));
