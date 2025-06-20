export interface FileItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileItem[];
    expanded?: boolean;
}
