import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [],
  templateUrl: './images.component.html',
  styleUrl: './images.component.css'
})
export class ImagesComponent {
  @Input() imageSrc: string = '';
  @Input() imageSrc2: string = '';

  zoomImage(event: MouseEvent): void {
    const img = event.target as HTMLImageElement;
    const container = img.parentElement;
    
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const x = (event.clientX - containerRect.left) / containerRect.width;
    const y = (event.clientY - containerRect.top) / containerRect.height;
    
    img.style.transform = `scale(1.5)`;
    img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  }

  resetZoom(event: MouseEvent): void {
    const img = event.target as HTMLImageElement;
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center';
  }
}
