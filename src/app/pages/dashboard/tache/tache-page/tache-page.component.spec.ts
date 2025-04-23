import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TachePageComponent } from './tache-page.component';

describe('TachePageComponent', () => {
  let component: TachePageComponent;
  let fixture: ComponentFixture<TachePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TachePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TachePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
