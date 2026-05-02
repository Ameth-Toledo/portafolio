import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworksCuandoUsarComponent } from './frameworks-cuando-usar.component';

describe('FrameworksCuandoUsarComponent', () => {
  let component: FrameworksCuandoUsarComponent;
  let fixture: ComponentFixture<FrameworksCuandoUsarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameworksCuandoUsarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameworksCuandoUsarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
