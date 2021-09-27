import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  changePage = new EventEmitter();

  constructor() { }

  setNewDataHeader(title: string){
    this.changePage.emit(title);
  }
}
