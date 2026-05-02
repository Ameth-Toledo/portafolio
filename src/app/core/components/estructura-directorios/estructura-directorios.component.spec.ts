import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraDirectoriosComponent } from './estructura-directorios.component';

describe('EstructuraDirectoriosComponent', () => {
  let component: EstructuraDirectoriosComponent;
  let fixture: ComponentFixture<EstructuraDirectoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstructuraDirectoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstructuraDirectoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
