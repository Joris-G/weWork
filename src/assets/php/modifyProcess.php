<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['toMod']) {
    case 'operationName':
        $sql = "UPDATE t_process_operation SET NOM_OPERATION = :newNom WHERE ID_OPERATION = :idOpe";
        $query = $con->createQuery($sql, [
            'newNom' => $_GET['newNom'],
            'idOpe' => $_GET['idOperation']
        ]);
        break;
    case 'groupName':
        $sql = "UPDATE t_process_subope_groups SET NOM = :newNom WHERE ID_GROUP = :idGroup";
        $query = $con->createQuery($sql, [
            'newNom' => $_GET['newNom'],
            'idGroup' => $_GET['idGroup']
        ]);
        break;
    case 'subOpName':
        $sql = "UPDATE t_process_suboperations SET DESCRIPTION_OPERATION = :newNom WHERE ID_SUB_OPERATION = :idSubOp";
        $query = $con->createQuery($sql, [
            'newNom' => $_GET['newNom'],
            'idSubOp' => $_GET['idSubOp']
        ]);
        break;
    case 'instructionText':
        $sql = "UPDATE t_process_instructions SET INSTRUCTION = :newInstruction WHERE ID_STEP = :idStep";
        $query = $con->createQuery($sql, [
            'newInstruction' => $_GET['newInstruction'],
            'idStep' => $_GET['idStep']
        ]);
        break;
    default:
        # code...
        break;
}
