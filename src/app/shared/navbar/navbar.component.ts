import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.styl']
})
export class NavbarComponent implements OnInit {
  title: string = '';

  constructor(
    private router: Router,
    private _events: EventsService
  ) { }

  ngOnInit(): void {
    this._events.changePage.subscribe(response =>{
      if(response){
        this.title = response;
      }
    })
  }

  /**
   * Navegación de módulos
   */
  changeRoute(destiny: string) {
    switch (destiny) {
      case 'REGISTER':
        this.router.navigate(['/pages/candidates']);
        break;
      case 'PHASES':
        this.router.navigate(['/pages/phases']);
    }
  }

}
