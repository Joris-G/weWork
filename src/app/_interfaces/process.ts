export interface Process {
    ARTICLE_SAP: string,
    DATE_DE_CREATION: string,
    DATE_DE_DERNIERE_MODIFICATION: string,
    ID_PROCESS: string,
    INDICE_PROCESS: string,
    LISTE_OPERATIONS: Operation[],
    UTILISATEUR_CREATION: string,
    UTILISATEUR_DERNIERE_MODIFICATION: string,
}
export interface Operation {
    CREE_PAR: string,
    DATE_DE_CREATION: string,
    DATE_DE_MODIFICATION: string,
    ID_OPERATION: string,
    ID_PROCESS: string,
    MODIFIE_PAR: string,
    NOM_OPERATION: string,
    OPERATION_GROUP: GroupSubOpe[],
    ORDRE: string,
}
export interface GroupSubOpe {
    FI: string,
    ID_GROUP: string,
    ID_OPERATION: string,
    INDICE_FI: string,
    NOM: string,
    OPERATIONS_DETAILLEES: SubOperation[],
    ORDRE: string,
}
export interface SubOperation {
    DESCRIPTION_OPERATION: string,
    ID_GROUP: string,
    ID_OPERATION_DETAILLEE: string,
    ORDRE: string,
    STEPS: Step[],
    TYPE_UTILISATEUR: string,
}
export interface Step {
    ID_STEP: string,
    ID_SUB_OPERATION: string,
    INSTRUCTION: Instruction,
    ORDRE: string,
}
export interface Instruction {
    ID_PROCESS_INSTRUCTION: string,
    ID_STEP: string,
    IMAGE_URL: string,
    INSTRUCTION: string,
    ORDRE: string,
}
export interface Traca {
    CREE_PAR: string,
    DATE_DE_CREATION: string,
    DATE_DE_MODIFICATION: string,
    DATE_DE_SUPPRESSION: string,
    ID_STEP: string,
    ID_TRACA: string,
    IMAGE_TRACA: string,
    MODIFIE_PAR: string,
    ROLE: string,
    SUPPRIME_PAR: string,
    TEXTE_INSTRUCTION: string,
    TRACA_DETAILS: any[],
    TYPE_TRACA: "1",
}
export interface TracaDetail {
    ID_TRACA: string,
    ID_TRACA_CONTROLE: string,
    ID_TYPE_ECME: string,
    ROLE: string,
    TEXTE_TRACA: string,
}