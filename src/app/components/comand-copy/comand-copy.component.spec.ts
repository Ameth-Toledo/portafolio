import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandCopyComponent } from './comand-copy.component';

describe('ComandCopyComponent', () => {
  let component: ComandCopyComponent;
  let fixture: ComponentFixture<ComandCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
