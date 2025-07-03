import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBlogComponent } from './header-blog.component';

describe('HeaderBlogComponent', () => {
  let component: HeaderBlogComponent;
  let fixture: ComponentFixture<HeaderBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
