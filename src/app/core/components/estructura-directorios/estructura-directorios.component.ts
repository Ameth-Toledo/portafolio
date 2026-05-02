import { Component, Input } from '@angular/core';
import { FileItem } from '../../models/file-item';

@Component({
  selector: 'app-estructura-directorios',
  standalone: true,
  imports: [],
  templateUrl: './estructura-directorios.component.html',
  styleUrl: './estructura-directorios.component.css'
})
export class EstructuraDirectoriosComponent {
  @Input() structure: FileItem[] = [];
  @Input() rootName: string = 'PROYECTO';

  toggleFolder(folder: FileItem): void {
    if (folder.type === 'folder') {
      folder.expanded = !folder.expanded;
    }
  }

  getIcon(item: FileItem): string {
    const fileExtension = this.getFileExtension(item.name);
    const fileName = item.name.toLowerCase();

    if (item.type === 'folder') {
      return item.expanded 
        ? 'fas fa-folder-open' 
        : 'fas fa-folder';
    }

    if (fileName === '.env') return 'fas fa-cog';
    if (fileName === '.gitignore') return 'fab fa-git-alt';
    if (fileName === 'readme.md') return 'fas fa-book-open';
    if (fileName === 'go.mod' || fileName === 'go.sum') return 'fab fa-golang';

    switch(fileExtension) {
      case 'go': return 'fab fa-golang';
      case 'js': return 'fab fa-js-square';
      case 'ts': return 'fas fa-code';
      case 'html': return 'fab fa-html5';
      case 'css': return 'fab fa-css3-alt';
      case 'json': return 'fas fa-brackets-curly';
      case 'md': return 'fab fa-markdown';
      case 'yaml':
      case 'yml': return 'fas fa-file-code';
      default: return 'fas fa-file';
    }
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }
}
