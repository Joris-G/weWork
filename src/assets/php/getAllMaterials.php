<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_materials";
$query = $con->createQuery($sql, );
$materialList = $query->fetchAll();

echo(json_encode($materialList));