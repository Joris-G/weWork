
<?php
require 'Connexion.php';
$con = new Connexion();
$sql = "SELECT * FROM t_prod_traca WHERE ID_TRACA = :idTraca";
$query = $con->createQuery($sql, ['idTraca' => $_GET['idTraca']]);
$previousTracas = $query->fetchAll();

foreach ($previousTracas as $key => $previousTraca) {
    //
    $sql = "SELECT * FROM t_prod_process WHERE ID_PROD_PROCESS = (SELECT ID_PROD_PROCESS FROM t_prod_suboperations WHERE ID_PROD_SUBOP = (SELECT ID_PROD_SUBOP FROM t_prod_suboperation_steps WHERE ID_PROD_STEP = :idProdStep))";
    $query = $con->createQuery($sql, ['idProdStep' => $previousTraca['ID_PROD_STEP']]);
    $prodProcess = $query->fetch();

    $previousTracas[$key]['ORDRE_FABRICATION'] = $prodProcess['ORDRE_FABRICATION'];

    $previousTracas[$key]['PRENOM_PIECE'] = $prodProcess['PRENOM_PIECE'];
    switch ($_GET['tracaType']) {
        case 'mesure':
            $sql = "SELECT * FROM t_prod_traca_mesure WHERE ID_PROD_TRACA = :idProdTraca";
            $query = $con->createQuery($sql, ['idProdTraca' => $previousTraca['ID_PROD_TRACA']]);
            $previousDatas = $query->fetchAll();
            $previousTracas[$key]['DATAS'] = $previousDatas;

            foreach ($previousDatas as $keyDatas => $previousData) {
                $sql = "SELECT * FROM t_traca_mesure WHERE ID_TRACA_MESURE = :idTracaMesure";
                $query = $con->createQuery($sql, ['idTracaMesure' => $previousData['ID_TRACA_MESURE']]);
                $mesureDef = $query->fetch();
                $previousTracas[$key]['DATAS'][$keyDatas]['DEF'] = $mesureDef;
            }

            break;

        default:
            # code...
            break;
    }
}





echo (json_encode($previousTracas));
