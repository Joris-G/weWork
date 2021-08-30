export class Role {
  idRole: number;
  role: string;

  constructor(resRole: any) {
    this.idRole = resRole;
    this.role = roleList.find((role) => role.value == resRole).viewValue;
  }
}

const roleList = [{
  value: 1,
  viewValue: "ADMIN"
},
{
  value: 2,
  viewValue: "CONTROLE"
},
{
  value: 3,
  viewValue: "OPERATEUR"
},
{
  value: 4,
  viewValue: "PREPARATEUR"
},
{
  value: 5,
  viewValue: "GESTIONNAIRE"
},
{
  value: 6,
  viewValue: "CHEF D'EQUIPE"
},
{
  value: 7,
  viewValue: "CHEF DE LIGNE"
},
{
  value: 8,
  viewValue: "CHARGE AFFAIRE"
}
];
