import { CommonService } from './../../services/common.service';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { listCandidatesModel, listRoleModel, newCandidateModel, listPhase1Model, newPhase1Model, listPhase2Model, newPhase2Model, listPhase3Model, newPhase3Model } from '../../shared/models'
import { IconsTableComponent } from './../../shared/icons-table/icons-table.component';
import * as moment from 'moment'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake'
import pdFonts from 'pdfmake/build/vfs_fonts'
import { EventsService } from 'src/app/services/events.service';
pdfMake.vfs = pdFonts.pdfMake.vfs;

@Component({
  selector: 'app-candidates-register',
  templateUrl: './candidates-register.component.html',
  styleUrls: ['./candidates-register.component.styl']
})
export class CandidatesRegisterComponent implements OnInit {

  @ViewChild('delete_modal') delete_modal: any;
  @ViewChild('content') modal: any;

  list_candidates: listCandidatesModel[] = [];
  list_roles: listRoleModel[] = [];
  defaultColDef;
  searchValue: string;
  rowClass: 'row-class';
  columnDefs: any[] = [];
  form_candidate: FormGroup;
  item_selected: number;
  data_report_pdf: any = {};
  id_edit: boolean = false;


  constructor(
    private _api: ApiService,
    private _modalService: NgbModal,
    private fb: FormBuilder,
    private _common: CommonService,
    private _events: EventsService
  ) { }

  ngOnInit(): void {
    this._events.setNewDataHeader('Candidatos');
    this.configurateColumns();
    this.getListCandidates();
    this.initForm();
    this.getListRoles();
  }

  /**
   * Guardar nuevo candidato
   */

  saveNewCandidate() {
    if (this.form_candidate.valid) {
      let params: newCandidateModel = {
        identification_candidate: this.form_candidate.get('identification_candidate').value,
        name_candidate: this.form_candidate.get('name_candidate').value,
        role_id: parseInt(this.form_candidate.get('role_id').value),
        date_postulation: this.form_candidate.get('date_postulation').value,
        wage_aspiration: this.form_candidate.get('wage_aspiration').value,
        phase: 1,
        email_candidate: this.form_candidate.get('email_candidate').value,
        email_evaluator: this.form_candidate.get('email_evaluator').value,
      }
      console.log("Enviar: ", params);

      try {
        this._api.setNewCandidate(params).subscribe(response => {
          if (response == 'ok') {
            this._modalService.dismissAll();
            this.getListCandidates();
            this._common.showsuccess('Se ha guardado correctamente');
            this.form_candidate.reset();
          } else {
            this._common.showerror('Ha ocurrido un error');
          }
          console.log("Envio de datos: ", response);
        })
      } catch (error) {
        console.error(error);
      }

    } else {
      this._common.showwarning("Por favor llene todos los campos y asegurese que los emails sean válidos");
    }
  }

  deleteCandidate() {
    try {
      this._api.deleteCandidate(this.item_selected).subscribe(response => {
        if (response == 'ok') {
          this._common.showsuccess('Se ha eliminado correctamente');
          this._modalService.dismissAll();
          this.getListCandidates();
        }
      })
    } catch (error) {
      console.error(error)
    }
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
    this.form_candidate = this.fb.group({
      identification_candidate: ['', Validators.required],
      name_candidate: [, Validators.required],
      role_id: [, Validators.required],
      date_postulation: ['', Validators.required],
      wage_aspiration: [, Validators.required],
      email_candidate: ['', [Validators.email, Validators.required]],
      email_evaluator: [, [Validators.email, Validators.required]],
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
          this.list_candidates = response;
          this.list_candidates.forEach(element => {
            element.date_postulation = moment(element.date_postulation).format('YYYY-MM-DD')
            element.phase = element.phase == 4 ? 'APROBADO' : element.phase == 5 ? 'REPROBADO' : element.phase;
            element.wage_aspiration = this._common.formatCurrency(0, element.wage_aspiration)
            element.config = [
              {
                id_item: element.id,
                icon: 'icon-cross',
                color: 'red',
              },
              {
                id_item: element.id,
                icon: 'icon-edit',
                color: 'orange',
              },
              {
                id_item: element.id,
                icon: 'icon-file-pdf',
                color: 'green',
              }
            ]
          });
        }
      })
    } catch (error) {
      console.error(error);
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
    if (event.icon == 'icon-cross') { //Eliminar
      this.open(this.delete_modal, 'md');
    } else if (event.icon == 'icon-file-pdf') { // Pdf
      this.startConsultPhases();
    }else{// Editar
      this.id_edit = true;
      this.getDataEdit();
    }
  }

  /**
   * Obtener datos para edición
   */

  getDataEdit(){
    let data_found : listCandidatesModel = this.list_candidates.find(data => data.id == this.item_selected);
    this.form_candidate.patchValue({
      identification_candidate : data_found.identification_candidate,
      name_candidate : data_found.name_candidate,
      role_id : data_found.role_id,
      date_postulation : data_found.date_postulation,
      wage_aspiration : this._common.currencyToNumber(data_found.wage_aspiration),
      email_candidate : data_found.email_candidate,
      email_evaluator : data_found.email_evaluator
    })
    this.open(this.modal, 'xl');
  }

  /**
   * Actualizar candidato
   */
  updateCandidate(){
    let data_found : listCandidatesModel = this.list_candidates.find(data => data.id == this.item_selected);
    if (this.form_candidate.valid) {
      let params: newCandidateModel = {
        identification_candidate: this.form_candidate.get('identification_candidate').value,
        name_candidate: this.form_candidate.get('name_candidate').value,
        role_id: parseInt(this.form_candidate.get('role_id').value),
        date_postulation: this.form_candidate.get('date_postulation').value,
        wage_aspiration: this.form_candidate.get('wage_aspiration').value,
        phase: data_found.phase == 'APROBADO' ? 4 : data_found.phase == 'REPROBADO' ? 5 : data_found.phase,
        email_candidate: this.form_candidate.get('email_candidate').value,
        email_evaluator: this.form_candidate.get('email_evaluator').value,
      }
      console.log("Enviar: ", params);

      try {
        this._api.updateCandidate(this.item_selected ,params).subscribe(response => {
          if (response == 'ok') {
            this._modalService.dismissAll();
            this.getListCandidates();
            this._common.showsuccess('Se ha actualizado correctamente');
            this.form_candidate.reset();
          } else {
            this._common.showerror('Ha ocurrido un error');
          }
          console.log("Envio de datos: ", response);
        })
      } catch (error) {
        console.error(error);
      }

    } else {
      this._common.showwarning("Por favor llene todos los campos y asegurese que los emails sean válidos");
    }

  }
  
  /**
   * Inicio proceso reporte PDF
   */
  startConsultPhases() {
    this.data_report_pdf = {};
    this.consultDataPhase1();
  }

  /**
   * Reporte etapa1
   */

  consultDataPhase1() {
    this._api.getDataPhase1(this.item_selected).subscribe(response => {
      if (response) {
        this.data_report_pdf.PHASE1 = response;
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
        this.data_report_pdf.PHASE2 = response;
        this.consultDataPhase3();
      }
    })
  }

  /**
   * Reporte etapa 3
   */

  consultDataPhase3() {
    this._api.getDataPhase3(this.item_selected).subscribe(response => {
      if (response) {
        this.data_report_pdf.PHASE3 = response;
        console.log("Data report: ", this.data_report_pdf);
        this.generatePDF();
      }
    })
  }

  /**
   * Exportar PDF
   */

  generatePDF() {

    let comment1 : string = '';
    let comment2 : string = '';

    let data_found: listCandidatesModel = this.list_candidates.find(data => data.id == this.item_selected);

    let data_phase1 = [[{ text: `Calificación teórica`, alignment: 'center', bold: true },
    { text: `Calificación técnica`, alignment: 'center', bold: true },
    { text: `Evaluador`, alignment: 'center', bold: true }]];

    this.data_report_pdf.PHASE1.forEach(element => {
      let row = [{ text: element.theoretical_qualification, alignment: 'center', bold: false },
      { text: element.technical_qualification, alignment: 'center', bold: false },
      { text: element.evaluator_name, alignment: 'center', bold: false }]
      comment1 = element.comments;
      data_phase1.push(row)
    });

    let data_phase2 = [[{ text: `Calificación Psicológica`, alignment: 'center', bold: true },
    { text: `Calificación médica`, alignment: 'center', bold: true }]];

    this.data_report_pdf.PHASE2.forEach(element => {
      let row = [{ text: element.psychological_qualification, alignment: 'center', bold: false },
      { text: element.medical_qualification, alignment: 'center', bold: false }]
      comment2 = element.comments;
      data_phase2.push(row)
    });

    let data_phase3 = [[{ text: `Promedio`, alignment: 'center', bold: true },
    { text: `Salario`, alignment: 'center', bold: true },
    { text: `Fecha inicio`, alignment: 'center', bold: true }]];

    this.data_report_pdf.PHASE3.forEach(element => {
      let row = [{ text: element.average, alignment: 'center', bold: false },
      { text: data_found.phase == 'APROBADO' ? this._common.formatCurrency(0, element.salary)  : 0, alignment: 'center', bold: false },
      { text: data_found.phase == 'APROBADO' ? moment(element.first_day).format('YYYY-MM-DD') : '', alignment: 'center', bold: false }]
      data_phase3.push(row)
    });

    const documentDefinition = {
      content: [
        {
          text: `REPORTE DE ETAPA POR CANDIDATO \n\n CC: ${data_found.identification_candidate} \n\n ${data_found.name_candidate} \n\n Rol: ${data_found.role_name}\n\n Etapa: ${data_found.phase}\n\n Postulación: ${data_found.date_postulation}`,
          bold: true,
          fontSize: 13,
          alignment: 'center'
        },
        {
          text: `Etapa 1`,
          bold: true,
          fontSize: 11,
          alignment: 'left',
          margin: [0, 20, 0, 0]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                widths: [160, 160, 160],
                body: data_phase1
              }
            },
            { width: '*', text: '' },
          ],
          margin: [0, 20, 0, 0]
        },
        {
          text: `Comentarios: ${comment1}`,
          fontSize: 10,
          alignment: 'left',
          margin: [0, 20, 0, 0]
        },
        {
          text: `Etapa 2`,
          bold: true,
          fontSize: 11,
          alignment: 'left',
          margin: [0, 20, 0, 0]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                widths: [244, 244],
                body: data_phase2
              }
            },
            { width: '*', text: '' },
          ],
          margin: [0, 20, 0, 0]
        },
        {
          text: `Comentarios: ${comment2}`,
          fontSize: 10,
          alignment: 'left',
          margin: [0, 20, 0, 0]
        },
        {
          text: `Etapa 3`,
          bold: true,
          fontSize: 11,
          alignment: 'left',
          margin: [0, 20, 0, 0]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                widths: [160, 160, 160],
                body: data_phase3
              }
            },
            { width: '*', text: '' },
          ],
          margin: [0, 20, 0, 0]
        }

      ]
    }

    pdfMake.createPdf(documentDefinition).download(`Resultados ${data_found.name_candidate} - ${data_found.identification_candidate}`);
    this._common.showsuccess('Reporte exportado');
  }

  /**
   * Crear reporte de excel
   */
  excelTable() {
    this._api.exportToExcel(this.list_candidates, 'Candidatos_Devco');
  }

  /**
   * Datos de carga ag-Grid
   * @param event 
   */

  onGridReady(event) {

  }

}
