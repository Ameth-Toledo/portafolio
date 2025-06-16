import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router } from '@angular/router';
import { HeroComponent } from "../../components/hero/hero.component";
import { WorkSectionComponent } from "../../components/work-section/work-section.component";
import { AbouthMeComponent } from "../../components/abouth-me/abouth-me.component";
import { BlogComponent } from "../../components/blog/blog.component";
import { ContactComponent } from "../../components/contact/contact.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, WorkSectionComponent, AbouthMeComponent, BlogComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor (private router : Router) {}

  ngOnInit(): void {
    this.setupSmoothScroll();
  }

  private setupSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }  
}
