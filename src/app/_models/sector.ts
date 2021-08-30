export class Sector {
  idSector: number;
  sector: string;

  constructor(resSector: any) {
    this.idSector = resSector;
    this.sector = sectorList.find((sector, index) => index == resSector);
  }
}
const sectorList = [
  'OUTILLAGE',
  'COMPOSITE',
  'METALLIQUE',
  'FAL',
];
