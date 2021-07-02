<?php
require 'Connexion.php';
$con = new Connexion();
for ($i = 0; $i < $_GET['numberOfProducts']; $i++) {
  $sql = "INSERT INTO t_materials_entry (ID_MATERIALS, NUMERO_DE_LOT, DATE_DE_PEREMPTION)
  VALUES (:idMaterial, :batchNumber, :shelflife)";
  $query = $con->createQuery($sql, [
    'idMaterial' => $_GET['idMaterial'],
    'batchNumber' => $_GET['batchNumber'],
    'shelflife' => $_GET['shelflife']
  ]);
}



$sql = "SELECT * FROM t_materials_entry WHERE ID_MATERIALS = :idMaterial AND NUMERO_DE_LOT = :batchNumber";
$query = $con->createQuery($sql, [
  'idMaterial' => $_GET['idMaterial'],
  'batchNumber' => $_GET['batchNumber'],
]);
$result = $query->fetchAll();

echo json_encode($result);
