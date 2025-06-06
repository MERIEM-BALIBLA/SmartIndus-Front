import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipePageComponent } from './equipe-page.component';

describe('EquipePageComponent', () => {
  let component: EquipePageComponent;
  let fixture: ComponentFixture<EquipePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
