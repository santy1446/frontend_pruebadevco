import { CommonService } from './../../services/common.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { listCandidatesModel, emailModel, listRoleModel, newCandidateModel, listPhase1Model, newPhase1Model, listPhase2Model, newPhase2Model, listPhase3Model, newPhase3Model } from '../../shared/models'
import { IconsTableComponent } from './../../shared/icons-table/icons-table.component';
import * as moment from 'moment'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { cloneDeep } from "lodash";
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.styl']
})
export class PhasesComponent implements OnInit {

  @ViewChild('content') modal: any;

  list_candidates: listCandidatesModel[] = [];
  list_candidates_general: listCandidatesModel[] = [];
  list_candidates_phase1: listCandidatesModel[] = [];
  list_candidates_phase2: listCandidatesModel[] = [];
  list_candidates_phase3: listCandidatesModel[] = [];
  current_modal: string;
  list_roles: listRoleModel[] = [];
  defaultColDef;
  searchValue: string;
  rowClass: 'row-class';
  columnDefs: any[] = [];

  form_phase1: FormGroup;
  form_phase2: FormGroup;
  form_phase3: FormGroup;

  item_selected: number;
  current_tab: number = 1;
  gridApi;
  gridColumnApi;
  average: any = 0;
  aprove_candidate: boolean = false;


  constructor(
    private _api: ApiService,
    private _modalService: NgbModal,
    private fb: FormBuilder,
    private _common: CommonService,
    private _events: EventsService
  ) { }

  ngOnInit(): void {
    this._events.setNewDataHeader('Etapas');
    this.configurateColumns();
    this.getListCandidates();
    this.initForm();
    this.getListRoles();
  }
  /**
   * Listado de roles para formulario
   */

  getListRoles() {
    try {
      this._api.getListRoles().subscribe(response => {
        console.log("Roles: ", response);
        if (response) {
          this.list_roles = response;
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Iniciar formulario reactivo
   */

  initForm() {
    this.form_phase1 = this.fb.group({
      theoretical_qualification: [, Validators.required],
      technical_qualification: [, Validators.required],
      comments: ['', Validators.required],
      evaluator_name: [, Validators.required],
    })

    this.form_phase2 = this.fb.group({
      psychological_qualification: [, Validators.required],
      medical_qualification: [, Validators.required],
      comments: ['', Validators.required],
    })

    this.form_phase3 = this.fb.group({
      average: [, Validators.required],
      aprove: ['NO', Validators.required],
      salary: [''],
      first_day: [''],
    })

    this.aprove_candidate = false;
    this.form_phase3.get("salary").disable();
    this.form_phase3.get("first_day").disable();
    this.form_phase3.get("average").disable();

    this.form_phase3.get("aprove").valueChanges.subscribe(x => {
      console.log('aprove value changed')
      console.log(x)
      if(x == 'SI'){
        this.form_phase3.get('salary').setValidators([Validators.required]);
        this.form_phase3.get('first_day').setValidators([Validators.required]);
        this.form_phase3.get("salary").enable();
        this.form_phase3.get("first_day").enable();
        
        this.aprove_candidate = true;
      }else{
        this.form_phase3.get("salary").disable();
        this.form_phase3.get("first_day").disable();
        this.form_phase3.get('salary').clearValidators();
        this.form_phase3.get('first_day').clearValidators();
        this.form_phase3.get('salary').reset();
        this.form_phase3.get('first_day').reset();
        this.aprove_candidate = false;
      }
   })

  }

  /**
   * Obtener listado de candidatos
   */

  getListCandidates() {
    try {
      this._api.getListCandidates().subscribe(response => {
        console.log("Listado: ", response)
        if (response) {
          this.list_candidates_general = response;
          this.list_candidates_general.forEach(element => {
            element.date_postulation = moment(element.date_postulation).format('YYYY-MM-DD');
            element.wage_aspiration = this._common.formatCurrency(0, element.wage_aspiration);
            element.config = [
              {
                id_item: element.id,
                icon: 'icon-arrow-right',
                color: 'green',
              }
            ]
          });
          this.changeTab(this.current_tab);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  /**
  * Cambiar tab
  * @param tab número del tab
  */
  changeTab(tab: number) {
    this.searchValue = '';
    this.current_tab = tab;
    this.list_candidates_phase1 = cloneDeep(this.list_candidates_general.filter(data => data.phase == 1));
    this.list_candidates_phase2 = cloneDeep(this.list_candidates_general.filter(data => data.phase == 2));
    this.list_candidates_phase3 = cloneDeep(this.list_candidates_general.filter(data => data.phase == 3));

    switch (tab) {
      case 1:
        this.list_candidates = cloneDeep(this.list_candidates_phase1);
        break;
      case 2:
        this.list_candidates = cloneDeep(this.list_candidates_phase2);
        break;
      case 3:
        this.list_candidates = cloneDeep(this.list_candidates_phase3);
        break;
    }

    if (this.gridApi) {
      this.gridApi.redrawRows();
    }
  }

  /**
   * Abrir modal
   * @param content Elemento HREF del modal
   * @param size Tamaño
   */

  open(content, size: string) {
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size }).result.then((result) => {
    }, (reason) => {
    });
  }

  /**
   * Configuración de columnas
   */


  configurateColumns() {
    let that = this;
    this.columnDefs = [
      {
        headerName: 'Acciones',
        field: 'config',
        cellRendererFramework: IconsTableComponent,
        cellRendererParams: {
          clicked: function (data: any) {
            that.eventClickIcon(data)
          }
        },
        maxWidth: 90,
        cellStyle: { textAlign: 'center' }
      },
      { headerName: 'Identificación', field: 'identification_candidate', sortable: true, filter: true },
      { headerName: 'Nombre', field: 'name_candidate', sortable: true, filter: true },
      { headerName: 'Rol', field: 'role_name', sortable: true, filter: true },
      { headerName: 'Fecha postulación', field: 'date_postulation', sortable: true, filter: true },
      { headerName: 'Aspiración salarial', field: 'wage_aspiration', sortable: true, filter: true },
      { headerName: 'Etapa', field: 'phase', sortable: true, filter: true },
      { headerName: 'Email', field: 'email_candidate', sortable: true, filter: true },
      { headerName: 'Email evaluador', field: 'email_evaluator', sortable: true, filter: true },
    ];
  }

  /**
   * Click en icono
   * @param event icono seleccionado
   */

  eventClickIcon(event) {
    this.item_selected = event.id_item;
    console.log("Click: ", event);
    if (event.icon == 'icon-arrow-right') {
      let found_data = this.list_candidates_general.find(data => data.id == this.item_selected);
      this.current_modal = found_data.phase == 1 ? 'PHASE1' : found_data.phase == 2 ? 'PHASE2' : 'PHASE3';
      this.open(this.modal, 'lg');
      if(this.current_modal == 'PHASE3'){
        this.average = 0;
        this.consultDataPhase1();
      }
    }
  }

   /**
   * Reporte etapa1
   */

    consultDataPhase1() {
      this._api.getDataPhase1(this.item_selected).subscribe(response => {
        if (response) {
          this.average += response[0].theoretical_qualification;
          this.average += response[0].technical_qualification;
          this.consultDataPhase2();
        }
      })
    }

    /**
   * Reporte etapa2
   */

     consultDataPhase2() {
      this._api.getDataPhase2(this.item_selected).subscribe(response => {
        if (response) {
          this.average += response[0].psychological_qualification;
          this.average += response[0].medical_qualification;
          this.average = this.average / 4;
          this.average = this.average.toFixed(2)
          this.form_phase3.get('average').patchValue(this.average);
        }
      })
    }
  

  /**
   * Guardar información de etapa
   */

  saveDataPhase() {
    switch (this.current_modal) {
      case 'PHASE1':
        this.savePhase1();
        break;
      case 'PHASE2':
        this.savePhase2();
        break;
      case 'PHASE3':
        this.savePhase3();
        break;
    }
  }

  /**
   * Guardar datos etapa1
   */

  savePhase1(){
    if(this.form_phase1.valid){
      let params: newPhase1Model={
        id_candidate : this.item_selected,
        theoretical_qualification : this.form_phase1.get('theoretical_qualification').value,
        technical_qualification : this.form_phase1.get('technical_qualification').value,
        comments : this.form_phase1.get('comments').value,
        evaluator_name : this.form_phase1.get('evaluator_name').value,
      }
      console.log("data: ",params);

      try {
        this._api.setDataPhase1(params).subscribe(response=>{
          if(response=='ok'){
            this.updatePhaseCandidate(2);

            let candidate_found: listCandidatesModel = this.list_candidates_general.find(data=>data.id == this.item_selected);
            let email: emailModel={
              destinatary: candidate_found.email_candidate + ',' + candidate_found.email_evaluator,
              subject: 'Novedad candidato',
              message: `Se informa que el candidato ${candidate_found.name_candidate} identificado con la CC: ${candidate_found.identification_candidate}
               ha pasado a la segunda etapa de la prueba`
            }

            this.sendEmail(email);
          }else{
            this._common.showerror('Ha ocurrido un error');
          }
        })
      } catch (error) {
        console.error(error);
      }
    }else{
      this._common.showwarning("Por favor llene todos los datos");
    }
  }

  /**
   * Guardar datos etapa2
   */

  savePhase2(){
    if(this.form_phase2.valid){
      let params: newPhase2Model={
        id_candidate : this.item_selected,
        psychological_qualification : this.form_phase2.get('psychological_qualification').value,
        medical_qualification : this.form_phase2.get('medical_qualification').value,
        comments : this.form_phase2.get('comments').value,
      }

      try {
        this._api.setDataPhase2(params).subscribe(response=>{
          if(response=='ok'){
            this.updatePhaseCandidate(3);
            let candidate_found: listCandidatesModel = this.list_candidates_general.find(data=>data.id == this.item_selected);
            let email: emailModel={
              destinatary: candidate_found.email_candidate + ',' + candidate_found.email_evaluator,
              subject: 'Novedad candidato',
              message: `Se informa que el candidato ${candidate_found.name_candidate} identificado con la CC: ${candidate_found.identification_candidate}
               ha pasado a la tercera etapa de la prueba`
            }

            this.sendEmail(email);
          }else{
            this._common.showerror('Ha ocurrido un error');
          }
        })
      } catch (error) {
        console.error(error);
      }
      console.log("data: ",params);
    }else{
      this._common.showwarning("Por favor llene todos los datos");
    }
  }

  /**
   * Guardar datos estapa3
   */

  savePhase3(){
    if(this.form_phase3.valid){
      let params: newPhase3Model={
        id_candidate : this.item_selected,
        average : this.form_phase3.get('average').value,
        salary : this.form_phase3.get('salary').value ? this.form_phase3.get('salary').value : 0,
        first_day : this.form_phase3.get('first_day').value ? this.form_phase3.get('first_day').value : '1900-01-01',
      }
      let definitive_state = this.form_phase3.get('aprove').value == 'SI' ? 4 : 5; //4 Aprobado - 5 Denegado 
      try {
        this._api.setDataPhase3(params).subscribe(response=>{
          if(response=='ok'){
            this.updatePhaseCandidate(definitive_state);
            let candidate_found: listCandidatesModel = this.list_candidates_general.find(data=>data.id == this.item_selected);
            let email: emailModel={
              destinatary: candidate_found.email_candidate + ',' + candidate_found.email_evaluator,
              subject: 'Novedad candidato',
              message: `Se informa que el candidato ${candidate_found.name_candidate} identificado con la CC: ${candidate_found.identification_candidate}
               ha terminado la última etapa y está ${definitive_state == 4 ? 'APROBADO' : 'REPROBADO'}`
            }

            this.sendEmail(email);
          }else{
            this._common.showerror('Ha ocurrido un error');
          }
        })
      } catch (error) {
        console.error(error);
      }
      console.log("data: ",params);
    }else{
      this._common.showwarning("Por favor llene todos los datos");
    }
    
  }

  /**
   * Enviar email
   */
  sendEmail(data: emailModel){
    this._api.setEmail(data).subscribe(response=>{
      this._common.showsuccess(response.slice(0, 13));
    })
  }

  /**
   * Actualizar la etapa del candidato
   * @param phase 
   */

  updatePhaseCandidate(phase: number){
    let params = {
      phase : phase
    }
    try {
      this._api.updateCandidatePhase(this.item_selected ,params).subscribe(response=>{
        if(response == 'ok'){
          this._common.showsuccess('Candidato actualizado');
          this.refreshData();
        }else{
          this._common.showerror('Ha ocurrido un error');
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  refreshData(){
    this._modalService.dismissAll();
    this.form_phase1.reset();
    this.form_phase2.reset();
    this.form_phase3.reset();
    this.getListCandidates();
  }

  /**
   * Datos de carga ag-Grid
   * @param event 
   */

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
