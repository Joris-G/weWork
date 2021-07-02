<?php
require 'Connexion.php';
$con = new Connexion();


// //Test si idProdTraca existe
// $sql = "SELECT * FROM t_prod_traca WHERE ID_PROD_STEP = :idProdStep AND ID_TRACA = :idTraca";
// $query = $con->createQuery($sql, [
//     'idProdStep' => $_GET['idProdStep'],
//     'idTraca' => $_GET['idTraca'],
// ]);
// $idProdTraca = $query->fetch();
// // var_dump($idProdTraca);

// if (!$idProdTraca) {
//     $sql = "INSERT INTO t_prod_traca (ID_PROD_STEP, ID_TRACA, DATE_TRACA, `SANCTION`)
// VALUES (:idProdStep, :idTraca, NOW(), :sanction)";
//     $query = $con->createQuery($sql, [
//         'idProdStep' => $_GET['idProdStep'],
//         'idTraca' => $_GET['idTraca'],
//         'sanction' => $_GET['sanction']
//     ]);
//     $sql = "SELECT * FROM t_prod_traca WHERE ID_PROD_STEP = :idProdStep AND ID_TRACA = :idTraca";
//     $query = $con->createQuery($sql, [
//         'idProdStep' => $_GET['idProdStep'],
//         'idTraca' => $_GET['idTraca'],
//     ]);
//     $idProdTraca = $query->fetch();
//     // var_dump($idProdTraca);
// }

switch ($_GET['tracaType']) {
    case 'controle':
            $sql = "UPDATE t_prod_traca_controle SET ID_ECME = :idEcme, SANCTION = :sanction, COMMENTAIRE = :comment, DATE_MODIFICATION = NOW(), MODIFIE_PAR = :userMod WHERE ID_PROD_TRACA_CONTROLE = :idProdTracaControle";
            $query = $con->createQuery($sql, [
                'idProdTracaControle' => $_GET['idProdTracaControle'],
                'idEcme' => ($_GET['idEcme']!= 'undefined') ? $_GET['idEcme'] : '',
                'sanction' => $_GET['sanction'],
                'comment' => $_GET['comment'],
                'userMod' => $_GET['userMod']
            ]);

        $sql = "SELECT * FROM t_prod_traca_controle WHERE ID_PROD_TRACA_CONTROLE = :idProdTracaControle";
        $query = $con->createQuery($sql, [
            'idProdTracaControle' => $_GET['idProdTracaControle'],
        ]);

        break;
    case 'matiere':
        $sql = "UPDATE t_prod_traca_matiere SET ID_MATIERE = :idMat, SANCTION = :sanction ,COMMENTAIRE = :comment ,DATE_MODIFICATION = NOW(), MODIFIE_PAR = :userMod WHERE ID_PROD_TRACA_MATIERE = :idProdTracaMatiere";
        $query = $con->createQuery($sql, [
            'idProdTracaMatiere' => $_GET['idProdTracaMatiere'],
            'idMat' => $_GET['idMat'],
            'sanction' => $_GET['sanction'],
            'comment' => $_GET['comment'],
        ]);

        $sql = "SELECT * FROM t_prod_traca_matiere WHERE ID_PROD_TRACA_MATIERE = :idProdTracaMatiere";
        $query = $con->createQuery($sql, [
            'idProdTracaMatiere' => $_GET['idProdTracaMatiere'],
        ]);
        break;
    case 'of':
        $ofList = explode(',', $_GET['recordedOf']);
        // var_dump($ofList);
        foreach ($ofList as $key => $of) {
            $sql = "UPDATE t_prod_traca_of SET OF = :of, SANCTION = :sanction, COMMENTAIRE = :comment ,DATE_MODIFICATION = NOW(), MODIFIE_PAR = :modUser WHERE ID_PROD_TRACA_OF = :idProdTracaOf";
            $query = $con->createQuery($sql, [
                'idProdTracaOf' => $_GET['idProdTracaOf'],
                'of' => $of,
                'sanction' => $_GET['sanction'],
                'comment' => $_GET['comment'],
            ]);
        }
        $sql = "SELECT * FROM t_prod_traca_of WHERE ID_PROD_TRACA_OF = :idProdTracaOf";
        $query = $con->createQuery($sql, [
          'idProdTracaOf' => $_GET['idProdTracaOf'],
        ]);
        break;
    default:
        # code...
        break;
}
$result = $query->fetch();
// $prodTracaDetail = $query->fetch();
// $result = array(
//     'prodTraca' => $idProdTraca,
//     'prodTracaDetail' => $prodTracaDetail
// );
echo json_encode($result);
