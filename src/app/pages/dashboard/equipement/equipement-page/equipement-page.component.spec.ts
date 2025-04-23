import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementPageComponent } from './equipement-page.component';

describe('EquipementPageComponent', () => {
  let component: EquipementPageComponent;
  let fixture: ComponentFixture<EquipementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
