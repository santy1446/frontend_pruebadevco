import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsTableComponent } from './icons-table.component';

describe('IconsTableComponent', () => {
  let component: IconsTableComponent;
  let fixture: ComponentFixture<IconsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
