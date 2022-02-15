export class Sector {
  idSector: number;
  sector: string;

  constructor(resSector: number) {
    this.idSector = resSector-1;
    // this.sector = sectorList.find((sector, index) => index == resSector);
    this.sector = sectorList[resSector-1];
  }
}
const  sectorList =[
  'OUTILLAGE',
  'COMPOSITE',
  'METALLIQUE',
  'FAL',
];
