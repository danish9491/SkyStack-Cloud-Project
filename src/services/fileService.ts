
// Mock data and services for the file management system
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

// Types
export type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  fileType?: string;
  size?: number;
  createdAt: string;
  updatedAt: string;
  starred?: boolean;
  shared?: boolean;
  filePath?: string;
  parentFolderId?: string | null;
};

export type FolderPath = {
  id: string;
  name: string;
};

export type FileUploadResponse = {
  success: boolean;
  file?: FileItem;
  error?: string;
};

export type FolderCreateResponse = {
  success: boolean;
  folder?: FileItem;
  error?: string;
};

export type FileSearchResponse = {
  files: FileItem[];
  folders: FileItem[];
};

export type StorageStats = {
  usedStorage: number; // in bytes
  totalStorage: number; // in bytes
  fileCount: number;
  folderCount: number;
  breakdown?: Array<{ type: string; size: number; color: string }>;
};

// Mock storage for files and folders
let mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Proposal.docx',
    type: 'file',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 2500000, // 2.5 MB
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z',
    starred: false,
    shared: false,
    filePath: '/root/documents/Project Proposal.docx',
    parentFolderId: '101',
  },
  {
    id: '2',
    name: 'Budget 2023.xlsx',
    type: 'file',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 1800000, // 1.8 MB
    createdAt: '2023-01-10T08:45:00Z',
    updatedAt: '2023-01-12T14:20:00Z',
    starred: true,
    shared: true,
    filePath: '/root/documents/Budget 2023.xlsx',
    parentFolderId: '101',
  },
  {
    id: '3',
    name: 'Team Photo.jpg',
    type: 'file',
    fileType: 'image/jpeg',
    size: 4200000, // 4.2 MB
    createdAt: '2022-12-25T16:00:00Z',
    updatedAt: '2022-12-25T16:00:00Z',
    starred: true,
    shared: false,
    filePath: '/root/photos/Team Photo.jpg',
    parentFolderId: '102',
  },
  {
    id: '4',
    name: 'Product Demo.mp4',
    type: 'file',
    fileType: 'video/mp4',
    size: 58000000, // 58 MB
    createdAt: '2023-01-05T11:15:00Z',
    updatedAt: '2023-01-05T11:15:00Z',
    starred: false,
    shared: true,
    filePath: '/root/videos/Product Demo.mp4',
    parentFolderId: '103',
  },
  {
    id: '5',
    name: 'Meeting Notes.txt',
    type: 'file',
    fileType: 'text/plain',
    size: 25000, // 25 KB
    createdAt: '2023-01-18T09:00:00Z',
    updatedAt: '2023-01-18T15:30:00Z',
    starred: false,
    shared: false,
    filePath: '/root/Meeting Notes.txt',
    parentFolderId: null,
  },
];

let mockFolders: FileItem[] = [
  {
    id: '101',
    name: 'Documents',
    type: 'folder',
    createdAt: '2022-12-01T10:00:00Z',
    updatedAt: '2023-01-15T10:30:00Z',
    starred: false,
    shared: false,
    parentFolderId: null,
  },
  {
    id: '102',
    name: 'Photos',
    type: 'folder',
    createdAt: '2022-12-01T10:05:00Z',
    updatedAt: '2022-12-25T16:00:00Z',
    starred: false,
    shared: false,
    parentFolderId: null,
  },
  {
    id: '103',
    name: 'Videos',
    type: 'folder',
    createdAt: '2022-12-01T10:10:00Z',
    updatedAt: '2023-01-05T11:15:00Z',
    starred: false,
    shared: false,
    parentFolderId: null,
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Alias functions to match the imports in Dashboard.tsx
export const fetchAllItems = async (folderId: string | null = null, view: 'all' | 'starred' | 'shared' | 'trash' | 'recent' = 'all'): Promise<FileItem[]> => {
  await delay(800);
  
  switch (view) {
    case 'starred':
      return getStarredItems();
    case 'shared':
      return getSharedItems();
    case 'recent':
      return getRecentFiles();
    case 'trash':
      // Mock implementation for trash items
      return [];
    case 'all':
    default:
      return getFiles(folderId);
  }
};

// Get all files and folders in the root or specific folder
export const getFiles = async (folderId: string | null = null): Promise<FileItem[]> => {
  await delay(800);
  
  const folderFiles = mockFiles.filter(file => file.parentFolderId === folderId);
  const folders = mockFolders.filter(folder => folder.parentFolderId === folderId);
  
  return [...folders, ...folderFiles];
};

// Get a specific file or folder by ID
export const getFileById = async (fileId: string): Promise<FileItem | null> => {
  await delay(500);
  
  const file = mockFiles.find(f => f.id === fileId);
  if (file) return file;
  
  const folder = mockFolders.find(f => f.id === fileId);
  if (folder) return folder;
  
  return null;
};

// Get recent files
export const getRecentFiles = async (): Promise<FileItem[]> => {
  await delay(800);
  
  // Sort files by updatedAt date and take the most recent ones
  return [...mockFiles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);
};

// Get starred files and folders
export const getStarredItems = async (): Promise<FileItem[]> => {
  await delay(800);
  
  const starredFiles = mockFiles.filter(file => file.starred);
  const starredFolders = mockFolders.filter(folder => folder.starred);
  
  return [...starredFolders, ...starredFiles];
};

// Get shared files and folders
export const getSharedItems = async (): Promise<FileItem[]> => {
  await delay(800);
  
  const sharedFiles = mockFiles.filter(file => file.shared);
  const sharedFolders = mockFolders.filter(folder => folder.shared);
  
  return [...sharedFolders, ...sharedFiles];
};

// Get folder breadcrumb path
export const getFolderPath = async (folderId: string): Promise<FolderPath[]> => {
  await delay(500);
  
  // This is a simplified implementation
  // In a real app, you would traverse up the folder tree
  const folder = mockFolders.find(f => f.id === folderId);
  if (!folder) return [];
  
  return [
    { id: 'root', name: 'My Drive' },
    { id: folder.id, name: folder.name },
  ];
};

// Get breadcrumb path - alias for Dashboard.tsx
export const getBreadcrumbPath = async (folderId: string | null): Promise<FolderPath[]> => {
  if (!folderId) return [];
  return getFolderPath(folderId);
};

// Upload a file
export const uploadFile = async (file: File, folderId: string | null = null): Promise<FileUploadResponse> => {
  await delay(1500);
  
  try {
    // Create a new file object
    const newFile: FileItem = {
      id: uuidv4(),
      name: file.name,
      type: 'file',
      fileType: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
      shared: false,
      parentFolderId: folderId,
    };
    
    mockFiles.push(newFile);
    
    return {
      success: true,
      file: newFile,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: 'Failed to upload file. Please try again.',
    };
  }
};

// Create a new folder
export const createFolder = async (name: string, parentFolderId: string | null = null): Promise<FolderCreateResponse> => {
  await delay(1000);
  
  try {
    // Check if a folder with the same name exists in the same location
    const folderExists = mockFolders.some(
      f => f.name === name && f.parentFolderId === parentFolderId
    );
    
    if (folderExists) {
      return {
        success: false,
        error: 'A folder with this name already exists.',
      };
    }
    
    // Create new folder
    const newFolder: FileItem = {
      id: uuidv4(),
      name,
      type: 'folder',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
      shared: false,
      parentFolderId,
    };
    
    mockFolders.push(newFolder);
    
    return {
      success: true,
      folder: newFolder,
    };
  } catch (error) {
    console.error('Error creating folder:', error);
    return {
      success: false,
      error: 'Failed to create folder. Please try again.',
    };
  }
};

// Search for files and folders
export const searchFiles = async (query: string): Promise<FileSearchResponse> => {
  await delay(1000);
  
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return { files: [], folders: [] };
  }
  
  const matchedFiles = mockFiles.filter(
    file => file.name.toLowerCase().includes(normalizedQuery)
  );
  
  const matchedFolders = mockFolders.filter(
    folder => folder.name.toLowerCase().includes(normalizedQuery)
  );
  
  return {
    files: matchedFiles,
    folders: matchedFolders,
  };
};

// Delete a file or folder
export const deleteItem = async (item: FileItem): Promise<boolean> => {
  await delay(800);
  
  try {
    if (item.type === 'file') {
      mockFiles = mockFiles.filter(f => f.id !== item.id);
    } else {
      mockFolders = mockFolders.filter(f => f.id !== item.id);
      // Also delete all files and folders within this folder
      // This is a simplified implementation
      mockFiles = mockFiles.filter(f => f.parentFolderId !== item.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    return false;
  }
};

// Alias for Dashboard.tsx
export const trashItem = async (item: FileItem): Promise<boolean> => {
  return deleteItem(item);
};

// Alias for Dashboard.tsx
export const deleteItemPermanently = async (item: FileItem): Promise<boolean> => {
  return deleteItem(item);
};

// Star or unstar a file or folder
export const toggleStarred = async (item: FileItem, starred: boolean): Promise<boolean> => {
  await delay(500);
  
  try {
    if (item.type === 'file') {
      const fileIndex = mockFiles.findIndex(f => f.id === item.id);
      if (fileIndex !== -1) {
        mockFiles[fileIndex].starred = starred;
      }
    } else {
      const folderIndex = mockFolders.findIndex(f => f.id === item.id);
      if (folderIndex !== -1) {
        mockFolders[folderIndex].starred = starred;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating star status:', error);
    return false;
  }
};

// Alias for Dashboard.tsx
export const starItem = async (item: FileItem, starred: boolean): Promise<boolean> => {
  return toggleStarred(item, starred);
};

// Share a file or folder
export const shareItem = async (fileId: string, email: string, accessLevel: string, expiryDate: Date | null = null): Promise<boolean> => {
  await delay(1000);
  
  try {
    const file = mockFiles.find(f => f.id === fileId);
    if (file) {
      file.shared = true;
      return true;
    }
    
    const folder = mockFolders.find(f => f.id === fileId);
    if (folder) {
      folder.shared = true;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error sharing item:', error);
    return false;
  }
};

// Alias for Dashboard.tsx
export const shareFile = shareItem;

// Mock download function for Dashboard.tsx
export const downloadFile = async (fileId: string): Promise<{ url: string, fileName: string }> => {
  await delay(1000);
  
  const file = mockFiles.find(f => f.id === fileId);
  if (!file) {
    throw new Error('File not found');
  }
  
  // Create a fake download URL
  const url = `data:${file.fileType || 'application/octet-stream'};base64,dGhpcyBpcyBhIG1vY2sgZmlsZSBjb250ZW50`;
  
  return {
    url,
    fileName: file.name
  };
};

// Mock restore function for Dashboard.tsx
export const restoreItem = async (file: FileItem): Promise<boolean> => {
  await delay(800);
  return true;
};

// Get storage statistics
export const getStorageStats = async (): Promise<StorageStats> => {
  await delay(800);
  
  const usedStorage = mockFiles.reduce((total, file) => total + (file.size || 0), 0);
  
  // Add a mock breakdown for storage stats
  const breakdown = [
    { type: 'Documents', size: 4300000, color: '#4285f4' },
    { type: 'Images', size: 4200000, color: '#0f9d58' },
    { type: 'Videos', size: 58000000, color: '#f4b400' },
    { type: 'Others', size: 25000, color: '#db4437' }
  ];
  
  return {
    usedStorage,
    totalStorage: 15 * 1024 * 1024 * 1024, // 15 GB
    fileCount: mockFiles.length,
    folderCount: mockFolders.length,
    breakdown
  };
};
