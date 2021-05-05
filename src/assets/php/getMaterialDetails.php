<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_materials_entry WHERE ID_MAT = :idMat";
$query = $con->createQuery($sql, ['idMat' => $_GET['idMat']]);
$materialDetails = $query->fetch();

echo (json_encode($materialDetails));
