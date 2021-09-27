import { IconsTableComponent } from './icons-table/icons-table.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';




@NgModule({
  declarations: [NavbarComponent, IconsTableComponent],
  imports: [
    CommonModule
  ],
  exports: [NavbarComponent]
})
export class SharedModule { }
