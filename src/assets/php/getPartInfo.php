<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_article WHERE ARTICLE_SAP = :articleSap";
$query = $con->createQuery($sql, ['articleSap' => $_GET['articleSap']]);
$partInfo = $query->fetch();

echo (json_encode($partInfo));
