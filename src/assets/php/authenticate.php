<?php
require 'Connexion.php';
$con = new Connexion();
// Get the posted data.
$_POST = json_decode(file_get_contents("php://input"), true);
$sql = "SELECT * FROM t_user WHERE MATRICULE = :matricule AND MOT_DE_PASSE = :pass";
$query = $con->createQuery($sql, ['matricule' => $_POST['username'], 'pass' => $_POST['password']]);
$user = $query->fetch();

if ($user) {
    $sql = "UPDATE t_user SET DATE_DERNIERE_CONNEXION = NOW() WHERE MATRICULE = :matricule";
    $query = $con->createQuery($sql, ['matricule' => $_POST['username']]);
}
echo (json_encode($user));
