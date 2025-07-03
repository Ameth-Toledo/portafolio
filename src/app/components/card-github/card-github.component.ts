import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-github',
  standalone: true,
  imports: [],
  templateUrl: './card-github.component.html',
  styleUrl: './card-github.component.css'
})
export class CardGithubComponent {
  @Input() user : string = '';
  @Input() repoName : string = '';
}
