import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buenas-practicas-front',
  standalone: true,
  imports: [],
  templateUrl: './buenas-practicas-front.component.html',
  styleUrl: './buenas-practicas-front.component.css'
})
export class BuenasPracticasFrontComponent {
  constructor (private router : Router) {}

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }
}
