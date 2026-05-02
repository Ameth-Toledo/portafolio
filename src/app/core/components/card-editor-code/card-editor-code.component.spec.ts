import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditorCodeComponent } from './card-editor-code.component';

describe('CardEditorCodeComponent', () => {
  let component: CardEditorCodeComponent;
  let fixture: ComponentFixture<CardEditorCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEditorCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEditorCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
