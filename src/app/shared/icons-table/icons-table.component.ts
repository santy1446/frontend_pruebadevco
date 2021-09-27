import { Component, OnDestroy} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icons-table',
  templateUrl: './icons-table.component.html',
  styleUrls: ['./icons-table.component.styl']
})
export class IconsTableComponent implements ICellRendererAngularComp, OnDestroy {
  params: any;
  constructor() { }

  agInit(params: any): void {
    console.log("params ",params )
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean{
    return true;
  }

  ngOnDestroy() {
    // no need to remove the button click handler 
    // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
  }

  btnClickedHandler(item, event) {
    let data_send = item;
    this.params.clicked(data_send);
  }

}
