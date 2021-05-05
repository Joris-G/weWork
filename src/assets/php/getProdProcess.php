<?php
require 'Connexion.php';
header('content-Type: application/json');
$con = new Connexion();
// On charge le prodProcess
$sql = "SELECT * FROM t_prod_process WHERE ORDRE_FABRICATION = :workorder";
$query = $con->createQuery($sql, ['workorder' => $_GET['OF']]);
$prodProcess = $query->fetch();


//On charge les opérations liées au prodProcess
$sql = "SELECT * FROM t_prod_operation WHERE ID_PROD_PROCESS = :idProdProcess";
$query = $con->createQuery($sql, ['idProdProcess' => $prodProcess['ID_PROD_PROCESS']]);
$operations = $query->fetchAll();
//On ajoute
$prodProcess['operations'] = $operations;

//Pour chaque opérations on charge les suboperations
foreach ($operations as $key_operation => $operation) {
    $sql = "SELECT * FROM t_prod_suboperations WHERE ID_PROD_OPERATION = :idProdOperation";
    $query = $con->createQuery($sql, ['idProdOperation' => $operations['ID_PROD_OPERATION']]);
    $subOperations = $query->fetchAll();
    //On ajoute
    $prodProcess['operations'][$key_operation]['subOperations'] = $subOperations;

    // Pour chaque sous opération on charge les steps
    foreach ($subOperations as $key_subOpe => $subOperation) {
        $sql = "SELECT * FROM t_prod_suboperation_steps WHERE ID_PROD_SUBOP = :idProdSubOperation";
        $query = $con->createQuery($sql, ['idProdSubOperation' => $subOperation['ID_PROD_SUBOP']]);
        $subOperationSteps = $query->fetchAll();
        //On ajoute
        $prodProcess['operations'][$key_operation]['subOperations'][$key_subOpe]['steps'] = $subOperationSteps;

        // Pour chaque step on charge les tracas
        foreach ($subOperationSteps as $key_step => $subOperationStep) {
            $sql = "SELECT * FROM t_prod_traca WHERE ID_PROD_STEP = :idProdStep";
            $query = $con->createQuery($sql, ['idProdStep' => $subOperationStep['ID_PROD_STEP']]);
            $prodTraca = $query->fetch();
            //On ajoute
            $prodProcess['operations'][$key_operation]['subOperations'][$key_subOpe]['steps'][$key_step]['traca'] = $prodTraca;

            //On charge les détails
            $tableTypeList = ['t_prod_traca_mesure', 't_prod_traca_of', 't_prod_traca_matiere', 't_prod_traca_controle'];
            //Pour chaque type de traca on test si résultats. Si résultats on les chargent
            foreach ($tableTypeList as $key => $tableType) {
                $sql = "SELECT * FROM $tableType WHERE ID_PROD_TRACA = :idProdTraca";
                $query = $con->createQuery($sql, ['idProdTraca' => $subOperationStep['ID_PROD_TRACA']]);
                $prodTracaDetail = $query->fetchAll();
                if ($prodTracaDetail) {
                    //On ajoute
                    $prodProcess['operations'][$key_operation]['subOperations'][$key_subOpe]['steps'][$key_step]['traca']['tracaDetails'] = $prodTracaDetail;
                    break;
                }
            }
            //On charge les utilisateurs
            $sql = "SELECT * FROM 't_prod_traca_user' WHERE ID_PROD_TRACA = :idProdTraca";
            $query = $con->createQuery($sql, ['idProdTraca' => $subOperationStep['ID_PROD_TRACA']]);
            $prodTracaUser = $query->fetchAll();
            //On ajoute
            $prodProcess['operations'][$key_operation]['subOperations'][$key_subOpe]['steps'][$key_step]['traca']['users'] = $prodTracaUser;
        }
    }
}
echo json_encode($prodProcess);
