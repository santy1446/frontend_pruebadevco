import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.styl']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private _events: EventsService
  ) { }

  ngOnInit(): void {
    this._events.setNewDataHeader('Inicio');
  }

}
