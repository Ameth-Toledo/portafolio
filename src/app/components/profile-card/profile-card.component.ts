import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {
  technologies = [
    { name: 'Angular', icon: 'angular.svg' },
    { name: 'Figma', icon: 'figma.svg' },
    { name: 'Tailwind', icon: 'tailwind.svg' },
    { name: 'AWS', icon: 'aws.svg' },
    { name: 'Java', icon: 'java.svg' },
    { name: 'Go', icon: 'go.svg' },
    { name: 'MySQL', icon: 'mysql.svg' }
  ];
}