import { Tool } from './tool';
import { User } from './user';

export class ToolRequest {
  idToolRequest: number;
  tool: Tool;
  type: ToolRequestType;
  requestDescription: string;
  imgName: string;
  requestDate: Date;
  requestor: User ;
  needDate: Date;
  affectedTo: User;
  affectationDate: Date;
  toolingNote: string;
  status: RequestStatus;
  realDate: Date;
  realUser: User | any;

  public getIdToolRequest(): number {
    return this.idToolRequest;
  }

  public setIdToolRequest(idToolRequest: number): void {
    this.idToolRequest = idToolRequest;
  }

  public getTool(): Tool {
    return this.tool;
  }

  public setTool(tool: Tool): void {
    this.tool = tool;
  }

  public getType(): ToolRequestType {
    return this.type;
  }

  public setType(type: ToolRequestType): void {
    this.type = type;
  }

  public getRequestDescription(): string {
    return this.requestDescription;
  }

  public setRequestDescription(requestDescription: string): void {
    this.requestDescription = requestDescription;
  }

  public getImgName(): string {
    return this.imgName;
  }

  public setImgName(imgName: string): void {
    this.imgName = imgName;
  }

  public getRequestDate(): Date {
    return this.requestDate;
  }

  public setRequestDate(requestDate: Date): void {
    this.requestDate = requestDate;
  }

  public getRequestor(): User {
    return this.requestor;
  }

  public setRequestor(requestor: User): void {
    this.requestor = requestor;
  }

  public getNeedDate(): Date {
    return this.needDate;
  }

  public setNeedDate(needDate: Date): void {
    this.needDate = needDate;
  }

  public getAffectedTo(): User {
    return this.affectedTo;
  }

  public setAffectedTo(affectedTo: User): void {
    this.affectedTo = affectedTo;
  }

  public getAffectationDate(): Date {
    return this.affectationDate;
  }

  public setAffectationDate(affectationDate: Date): void {
    this.affectationDate = affectationDate;
  }

  public getToolingNote(): string {
    return this.toolingNote;
  }

  public setToolingNote(toolingNote: string): void {
    this.toolingNote = toolingNote;
  }

  public getStatus(): RequestStatus {
    return this.status;
  }

  public setStatus(status: RequestStatus): void {
    this.status = status;
  }

  public getRealDate(): Date {
    return this.realDate;
  }

  public setRealDate(realDate: Date): void {
    this.realDate = realDate;
  }

  public getRealUser(): User | any {
    return this.realUser;
  }

  public setRealUser(realUser: User): void {
    this.realUser = realUser;
  }

  constructor(
    // type: ToolRequestType,
    // requestDescription: string,
    // requestDate: Date,
    // requestor: User,
    // needDate: Date,
    // affectedTo: User,
    // affectationDate: Date,
    // status: RequestStatus,
    // idToolRequest?: number,
    // tool?: Tool,
    // imgName?: string,
    // toolingNote?: string,
    // realDate?: Date,
    // realUser?: User
    ) {

    // this.setAffectationDate(affectationDate);
    // this.setAffectedTo(affectedTo);
    // this.setIdToolRequest(idToolRequest);
    // this.setImgName(imgName);
    // this.setNeedDate(needDate);
    // this.setRealDate(realDate);
    // this.setRealUser(realUser);
    // this.setRequestDate(requestDate);
    // this.setRequestDescription(requestDescription);
    // this.setRequestor(requestor);
    // this.setStatus(status);
    // this.setTool(tool);
    // this.setToolingNote(toolingNote);
    // this.setType(type);

    // this.toolService.getToolById(idTool).then(response => {
    //   this.tool = new Tool(response);
    // })
  }
}


export enum ToolRequestType {
  SBO,
  MaintenanceAndUpgrading,
  Control3D,
}
export enum RequestStatus {
  NonAffected,
  StandBy,
  InWork,
  Close,
}
