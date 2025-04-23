import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionPageComponent } from './intervention-page.component';

describe('InterventionPageComponent', () => {
  let component: InterventionPageComponent;
  let fixture: ComponentFixture<InterventionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
