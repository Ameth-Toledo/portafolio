import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { Router } from '@angular/router';
import { CardContactComponent } from "../../components/card-contact/card-contact.component";
import { ProfileCardComponent } from "../../components/profile-card/profile-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CardContactComponent, ProfileCardComponent],
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

  scrollTo(target: string): void {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  openCertificate(): void {
    const pdfPath = 'pdf/UI-UXCertificado.pdf';
    window.open(pdfPath, '_blank');
  }

  sendToGoodPracticesFront(event: Event) {
    event.preventDefault();
    this.router.navigate(['buenas/practicas/de/front'])
  }
}
