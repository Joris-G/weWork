<?php
require 'Connexion.php';
$con = new Connexion();

switch ($_GET['typeOperation']) {
  case 'usersListByRole':
    switch ($_GET['role']) {
      case 'null':
        $sql = "SELECT * FROM t_user";
        $query = $con->createQuery($sql, []);
        break;

      default:
        $sql = "SELECT * FROM t_user WHERE `ROLE` = :idRole";
        $query = $con->createQuery($sql, [
          'idRole' => $_GET['role']
        ]);
        break;
    }

    $response = $query->fetchAll();
    break;
  case 'userById':
    $sql = "SELECT * FROM t_user WHERE `ID_UTILISATEUR` = :idUser";
    $query = $con->createQuery($sql, [
      'idUser' => $_GET['idUser']
    ]);
    $response = $query->fetch();
    break;

  case 'usersListByTeam':
    switch ($_GET['team']) {
      case 'null':
        $sql = "SELECT * FROM t_user";
        $query = $con->createQuery($sql, []);
        break;

      default:
        $sql = "SELECT * FROM t_user WHERE `NUM_EQUIPE` = :team";
        $query = $con->createQuery($sql, [
          'team' => $_GET['team']
        ]);
        break;
    }

    $response = $query->fetchAll();
    break;
  default:
    # code...
    break;
}

echo json_encode($response);
