import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechCardComponent } from "../tech-card/tech-card.component";

@Component({
  selector: 'app-tecnologias',
  standalone: true,
  imports: [CommonModule, TechCardComponent],
  templateUrl: './tecnologias.component.html',
  styleUrl: './tecnologias.component.css'
})
export class TecnologiasComponent {
tecnologias = [
    { iconPath: 'icons/angular.svg', techName: 'Angular' },
    { iconPath: 'icons/github-black.svg', techName: 'Github' },
    { iconPath: 'icons/go.svg', techName: 'Go' },
    { iconPath: 'icons/postman.svg', techName: 'Postman' },
    { iconPath: 'icons/linux.svg', techName: 'Linux' },
    { iconPath: 'icons/mysql.svg', techName: 'MySQL' },
    { iconPath: 'icons/typescript.svg', techName: 'TypeScript' },
    { iconPath: 'icons/python.svg', techName: 'Python' },
    { iconPath: 'icons/javascript.svg', techName: 'JavaScript' },
    { iconPath: 'icons/c.svg', techName: 'C++' },
    { iconPath: 'icons/java.svg', techName: 'Java' },
    { iconPath: 'icons/arduino.svg', techName: 'Arduino' },
    { iconPath: 'icons/figma.svg', techName: 'Figma' },
    { iconPath: 'icons/corel.svg', techName: 'Corel Draw' },
    { iconPath: 'icons/photoshop.svg', techName: 'Photoshop' },
    { iconPath: 'icons/aws.svg', techName: 'AWS' },
    { iconPath: 'icons/nodejs.svg', techName: 'Node JS' },
    { iconPath: 'icons/postgresql.svg', techName: 'PostgreSQL' },
    { iconPath: 'icons/react.svg', techName: 'React' },
    { iconPath: 'icons/vercel.svg', techName: 'Vercel' },
    { iconPath: 'icons/nginx.svg', techName: 'Nginx' },
    { iconPath: 'icons/docker.svg', techName: 'Docker' },
    { iconPath: 'icons/rabbitmq.svg', techName: 'RabbitMQ' },
    { iconPath: 'icons/tailwind.svg', techName: 'Tailwind' },
    { iconPath: 'icons/html.svg', techName: 'HTML' },
    { iconPath: 'icons/css.svg', techName: 'CSS' }
  ];
}
