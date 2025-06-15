import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-contact',
  standalone: true,
  imports: [],
  templateUrl: './card-contact.component.html',
  styleUrl: './card-contact.component.css'
})
export class CardContactComponent {
  @Input() name: string = '';
  @Input() url: string = '';
}
