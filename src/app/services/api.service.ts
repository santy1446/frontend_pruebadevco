import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {listCandidatesModel,emailModel, listRoleModel, newCandidateModel, listPhase1Model, newPhase1Model, listPhase2Model, newPhase2Model, listPhase3Model, newPhase3Model} from '../shared/models'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { DateTime } from 'luxon';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url_candidates: string = environment.URL + 'candidates'
  url_candidates_phase: string = environment.URL + 'candidates_phase'
  url_roles: string = environment.URL + 'roles'
  url_phase1: string = environment.URL + 'phase1'
  url_phase2: string = environment.URL + 'phase2'
  url_phase3: string = environment.URL + 'phase3'
  url_email: string = environment.URL + 'sendemail'

  constructor(
    private http: HttpClient
  ) { }

  //Metodos Candidatos

  getListCandidates() : Observable<Array<listCandidatesModel>>{
    return this.http.get<any[]>(this.url_candidates).pipe(map(data => data));
  }
  setNewCandidate(data: newCandidateModel) : Observable<any>{
    return this.http.post(this.url_candidates, data)
  }
  deleteCandidate(id: number): Observable<any>{
    return this.http.delete(this.url_candidates+'/'+id)
  }
  updateCandidatePhase(id: number, phase: any):Observable<any>{
    return this.http.put(this.url_candidates_phase+'/'+id, phase);
  }
  updateCandidate(id: number, data: newCandidateModel):Observable<any>{
    return this.http.put(this.url_candidates+'/'+id, data);
  }

  //Metodos roles

  getListRoles() : Observable<Array<listRoleModel>>{
    return this.http.get<any[]>(this.url_roles).pipe(map(data => data));
  }

  //Metodos Fases

  setDataPhase1(data: newPhase1Model) : Observable<any>{
    return this.http.post(this.url_phase1, data)
  }
  setDataPhase2(data: newPhase2Model) : Observable<any>{
    return this.http.post(this.url_phase2, data)
  }
  setDataPhase3(data: newPhase3Model) : Observable<any>{
    return this.http.post(this.url_phase3, data)
  }


  getDataPhase1(id: number) : Observable<any>{
    return this.http.get<any[]>(this.url_phase1+'/'+id).pipe(map(data => data));
  }
  getDataPhase2(id: number) : Observable<any>{
    return this.http.get<any[]>(this.url_phase2+'/'+id).pipe(map(data => data));
  }
  getDataPhase3(id: number) : Observable<any>{
    return this.http.get<any[]>(this.url_phase3+'/'+id).pipe(map(data => data));
  }

  //Metodo email

  setEmail(data: emailModel) : Observable<any>{
    return this.http.post(this.url_email, data)
  }

  //Generación de excel

  exportToExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // llamar metodo buffer y filename

    this.saveAsExcel(excelBuffer, excelFileName)
  }

  private saveAsExcel(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + DateTime.local().toString() + EXCEL_EXT)
  }



}
