import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-card',
  standalone: true,
  imports: [],
  templateUrl: './tech-card.component.html',
  styleUrl: './tech-card.component.css'
})
export class TechCardComponent {
  @Input() iconPath: string = '';
  @Input() techName: string = '';
}
