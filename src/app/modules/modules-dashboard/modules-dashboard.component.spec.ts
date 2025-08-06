import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesDashboardComponent } from './modules-dashboard.component';

describe('ModulesDashboardComponent', () => {
  let component: ModulesDashboardComponent;
  let fixture: ComponentFixture<ModulesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
