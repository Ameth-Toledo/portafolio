import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comand-copy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comand-copy.component.html',
  styleUrl: './comand-copy.component.css'
})
export class ComandCopyComponent {
  @Input() comand: string = '';
  isModalVisible : boolean = false;
  comandCopied : string = '';

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.comandCopied = text
      this.showModal();
    }).catch(err => {
      console.error('Error al copiar al portapapeles', err);
    });
  }

  showModal():void {
    this.isModalVisible = true;
    setTimeout(() => {
      this.isModalVisible = false;
      this.comandCopied = '';
    }, 3000);
  }
}
