import { Component } from '@angular/core';

@Component({
  selector: 'app-redes-sociales',
  standalone: true,
  imports: [],
  templateUrl: './redes-sociales.component.html',
  styleUrl: './redes-sociales.component.css'
})
export class RedesSocialesComponent {
  sendToGithub() {
    window.open('https://github.com/Ameth-Toledo', '_blank', 'noopener');
  }

  sendToFacebook() {
    window.open('https://www.facebook.com/ameth.toledo.2025/', '_blank', 'noopener')
  }

  sendToInstagram() {
    window.open('https://www.instagram.com/ameth_toled/', '_blank', 'noopener')
  }

  sendToLinkedin() {
    window.open('https://www.linkedin.com/in/ameth-de-jes%C3%BAs-m%C3%A9ndez-toledo/', '_blank', 'noopener')
  }
}
