import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-card-tecnology',
  standalone: true,
  imports: [],
  templateUrl: './card-tecnology.component.html',
  styleUrl: './card-tecnology.component.css'
})
export class CardTecnologyComponent {
  @Input() title: string = '';
}
