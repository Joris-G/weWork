<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_nom WHERE Parent = :articleSap";
$query = $con->createQuery($sql, ['articleSap' => $_GET['articleSap']]);
$partChildren = $query->fetchAll();

echo (json_encode($partChildren));
