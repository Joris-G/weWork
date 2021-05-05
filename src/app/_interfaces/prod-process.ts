export interface ProdProcess {
    ID_PROD_PROCESS: string,
    ID_PROCESS: string,
    ORDRE_FABRICATION: string,
    PRENOM_PIECE: string,
    DATE_LANCEMENT: string,
    DATE_DEBUT: string,
    DATE_FIN: string,
}
export interface ProdOperation {
    ID_PROD_OPERATION: string,
    ID_PROD_PROCESS: string,
    ID_OPERATION: string,
    DATE_DEBUT: string,
    DATE_FIN: string,
    CUMUL_TEMPS: string,
}
export interface ProdGroupSubOpe {

}
export interface ProdSubOperation {
    ID_PROD_SUBOP: string,
    ID_PROD_OPERATION: string,
    ID_PROCESS_SUBOPE: string,
    DATE_DEBUT: string,
    CUMUL_TEMPS: string,
    STATUS: string,
}
export interface ProdStep {
    ID_PROD_STEP: string,
    ID_PROD_SUBOP: string,
    ID_STEP: string,
    STATUS: string,
}
export interface ProdTraca {
    ID_PROD_TRACA: string,
    ID_PROD_STEP: string,
    ID_TRACA: string,
    DATE_TRACA: string,
    SANCTION: string,
    COMMENTAIRE: string,
    DATE_MODIFICATION: string,
    COMMENTAIRE_MODIFICATION: string,
}

export interface ProdTracaControle {
    ID_PROD_TRACA_CONTROLE: string,
    ID_PROD_TRACA: string,
    ID_TRACA_CONTROLE: string,
    ID_ECME: string,
    SANCTION: string,
    COMMENTAIRE: string,
    DATE_EXECUTION: string,
}
export interface ProdTracaMatiere {
    ID_PROD_TRACA_MATIERE: string,
    ID_PROD_TRACA: string,
    ID_TRACA_MATIERE: string,
    ID_MATIERE: string,
    SANCTION: string,
    COMMENTAIRE: string,
    DATE_EXECUTION: string,

}
export interface ProdTracaMesure {

    ID_PROD_TRACA_MESURE: string,
    ID_PROD_TRACA: string,
    ID_TRACA_MESURE: string,
    VALEUR: string,
    SANCTION: string,
    COMMENTAIRE: string,

}
export interface ProdTracaOf {
    ID_PROD_TRACA_OF: string,
    ID_PROD_TRACA: string,
    ID_TRACA_OF: string,
    OF: string,
    SANCTION: string,
    COMMENTAIRE: string,
    DATE_EXECUTION: string,

}
export interface ProdTracaUser {
    ID_PROD_TRACA_USER: string,
    ID_PROD_TRACA: string,
    USER: string,

}