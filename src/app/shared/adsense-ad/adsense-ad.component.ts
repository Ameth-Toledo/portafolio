import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adsense-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adsense-ad.component.html',
  styleUrl: './adsense-ad.component.css'
})
export class AdsenseAdComponent implements OnInit {
  ngOnInit() {
    setTimeout(() => {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }, 100);
  }
}