import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGithubComponent } from './card-github.component';

describe('CardGithubComponent', () => {
  let component: CardGithubComponent;
  let fixture: ComponentFixture<CardGithubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGithubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardGithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
