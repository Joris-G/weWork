<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['typeOperation']) {
  case 'prodProcess':
        $sql = "INSERT INTO t_prod_process (ID_PROCESS,ORDRE_FABRICATION, DATE_DEBUT) VALUES (:idProcess, :workorder, NOW())";
        $query = $con->createQuery($sql, [
            'idProcess' => $_GET['idProcess'],
            'workorder' => $_GET['workorder']
        ]);
        $sql = "SELECT * FROM t_prod_process WHERE ID_PROCESS = :idProcess AND ORDRE_FABRICATION=:workorder";
        $query = $con->createQuery($sql, [
            'idProcess' => $_GET['idProcess'],
            'workorder' => $_GET['workorder']
        ]);

        break;
    case 'ope':
        $sql = "INSERT INTO t_prod_operation (ID_OPERATION, DATE_DEBUT) VALUES (:idOperation, NOW())";
        $query = $con->createQuery($sql, [
            'idOperation' => $_GET['idOperation']
        ]);
        $sql = "SELECT * FROM t_prod_operation WHERE ID_OPERATION = :idOperation";
        $query = $con->createQuery($sql, [
            'idOperation' => $_GET['idOperation']
        ]);

        break;
    case 'subOpe':
        $sql = "INSERT INTO t_prod_suboperations (ID_PROD_PROCESS, ID_PROCESS_SUBOPE, DATE_DEBUT) VALUES (:idProdProcess, :idSubOpe, NOW())";
        $query = $con->createQuery($sql, [
            'idProdProcess' => $_GET['idProdProcess'],
            'idSubOpe' => $_GET['idSubOpe']
        ]);
        $sql = "SELECT * FROM t_prod_suboperations  WHERE ID_PROD_PROCESS = :idProdProcess AND ID_PROCESS_SUBOPE = :idSubOpe";
        $query = $con->createQuery($sql, [
            'idProdProcess' => $_GET['idProdProcess'],
            'idSubOpe' => $_GET['idSubOpe']
        ]);
        break;

    case 'step':
        $sql = "INSERT INTO t_prod_suboperation_steps (ID_PROD_SUBOP, ID_STEP, DATE_DEBUT) VALUES (:idProdSubOperation, :idStep, NOW())";
        $query = $con->createQuery($sql, [
            'idProdSubOperation' => $_GET['idProdSubOperation'],
            'idStep' => $_GET['idStep']
        ]);
        $sql = "SELECT * FROM t_prod_suboperation_steps WHERE ID_PROD_SUBOP = :idProdSubOperation AND ID_STEP = :idStep";
        $query = $con->createQuery($sql, [
            'idProdSubOperation' => $_GET['idProdSubOperation'],
            'idStep' => $_GET['idStep']
        ]);
        break;
        case 'workorder':
        $sql = "SELECT * FROM t_prod_workorder WHERE WORKORDER = :of";
        $query = $con->createQuery($sql, [
            'of' => $_GET['of'],
        ]);
        if($query->fetch()) {break;
        }
        $sql = "INSERT INTO t_prod_workorder (NOM_ARTICLE, WORKORDER, PRENOM_PIECE, DATE_LANCEMENT) VALUES (:articleSap, :of, :prenom, NOW())";
        $query = $con->createQuery($sql, [
            'articleSap' => $_GET['articleSap'],
            'of' => $_GET['of'],
            'prenom' => $_GET['name'],
        ]);
        $sql = "SELECT * FROM t_prod_workorder WHERE WORKORDER = :of";
        $query = $con->createQuery($sql, [
            'of' => $_GET['of'],
        ]);

        break;
        case 'testWorkorder':
        $sql = "SELECT * FROM t_prod_workorder WHERE WORKORDER = :of";
        $query = $con->createQuery($sql, [
            'of' => $_GET['of'],
        ]);
        break;
    default:
        # code...
        break;
}
$response = $query->fetch();
echo json_encode($response);
