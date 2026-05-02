import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tree-node">
      <div class="node-content" (click)="toggle()">
        <span class="indent" [style.width.px]="level * 16"></span>
        <span class="icon-wrapper">
          @if (item.type === 'folder') {
            <svg class="folder-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H9a3.5 3.5 0 0 1-1.5-.5H2.5z"/>
            </svg>
          } @else {
            <svg class="file-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.828L10.828 2H4zm1 1v2h3.5L5 5.5V1z"/>
            </svg>
          }
        </span>
        <span class="name" [class.folder]="item.type === 'folder'">{{ item.name }}</span>
      </div>
      @if (item.type === 'folder' && expanded && item.children) {
        @for (child of item.children; track child.id) {
          <app-tree-node [item]="child" [level]="level + 1"></app-tree-node>
        }
      }
    </div>
  `,
  styles: [`
    .tree-node {
      margin: 0;
    }
    .node-content {
      display: flex;
      align-items: center;
      padding: 3px 0;
      cursor: pointer;
      transition: background 0.15s;
      border-radius: 4px;
      user-select: none;
    }
    .node-content:hover {
      background: rgba(255,255,255,0.06);
    }
    .indent {
      display: inline-block;
      flex-shrink: 0;
    }
    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      margin-right: 6px;
      flex-shrink: 0;
    }
    .folder-icon {
      width: 16px;
      height: 16px;
      color: #58a6ff;
    }
    .file-icon {
      width: 14px;
      height: 14px;
      color: #8b949e;
    }
    .name {
      color: #c9d1d9;
      font-size: 13px;
      white-space: nowrap;
    }
    .name.folder {
      color: #58a6ff;
      font-weight: 500;
    }
  `]
})
export class TreeNodeComponent {
  @Input() item!: FileItem;
  @Input() level: number = 0;
  expanded: boolean = true;

  toggle() {
    if (this.item.type === 'folder') {
      this.expanded = !this.expanded;
    }
  }
}

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  template: `
    <div class="file-tree">
      <div class="file-tree-header">
        <span class="title">{{ title }}</span>
      </div>
      <div class="file-tree-body">
        @for (item of items; track item.id) {
          <app-tree-node [item]="item"></app-tree-node>
        }
      </div>
    </div>
  `,
  styles: [`
    .file-tree {
      background: #0A0A0A;
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
      font-size: 14px;
      color: #c9d1d9;
      border: 1px solid #30363d;
      width: 100%;
    }
    .file-tree-header {
      background: #111111;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #30363d;
    }
    .file-tree-header .title {
      color: #8b949e;
      font-size: 12px;
      font-family: 'Poppins', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .file-tree-body {
      padding: 10px 8px;
    }
  `]
})
export class FileTreeComponent {
  @Input() title: string = 'Explorador';
  @Input() items: FileItem[] = [];
}