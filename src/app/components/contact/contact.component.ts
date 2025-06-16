import { Component } from '@angular/core';
import { ProfileCardComponent } from "../profile-card/profile-card.component";
import { CardContactComponent } from "../card-contact/card-contact.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ProfileCardComponent, CardContactComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  handleSelectionChange(cardName: string, isSelected: boolean) {
    console.log(`${cardName} ${isSelected ? 'seleccionado' : 'deseleccionado'}`);
  }
}
