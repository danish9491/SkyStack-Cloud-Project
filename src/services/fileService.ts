
import { supabase } from "@/integrations/supabase/client";
import { FileItem } from "@/components/files/FileGrid";
import { Database } from "@/integrations/supabase/types";

export async function fetchFiles(folderId: string | null = null, view: 'all' | 'starred' | 'shared' | 'trash' | 'recent' = 'all') {
  try {
    let query = supabase.from('files')
      .select('*');
    
    // Add filters based on view
    if (view === 'starred') {
      query = query.eq('is_starred', true).eq('is_trashed', false);
    } else if (view === 'shared') {
      query = query.eq('shared', true).eq('is_trashed', false);
    } else if (view === 'trash') {
      query = query.eq('is_trashed', true);
    } else if (view === 'recent') {
      query = query.eq('is_trashed', false).order('updated_at', { ascending: false }).limit(10);
    } else if (view === 'all') {
      // If in a specific folder
      if (folderId) {
        query = query.eq('parent_folder_id', folderId).eq('is_trashed', false);
      } else {
        // Root folder (null parent)
        query = query.is('parent_folder_id', null).eq('is_trashed', false);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data ? transformFilesData(data) : [];
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export async function fetchFolders(parentFolderId: string | null = null, view: 'all' | 'starred' | 'shared' | 'trash' | 'recent' = 'all') {
  try {
    let query = supabase.from('folders')
      .select('*');
    
    // Add filters based on view
    if (view === 'starred') {
      query = query.eq('is_starred', true).eq('is_trashed', false);
    } else if (view === 'shared') {
      query = query.eq('shared', true).eq('is_trashed', false);
    } else if (view === 'trash') {
      query = query.eq('is_trashed', true);
    } else if (view === 'recent') {
      query = query.eq('is_trashed', false).order('updated_at', { ascending: false }).limit(10);
    } else if (view === 'all') {
      // If in a specific folder
      if (parentFolderId) {
        query = query.eq('parent_folder_id', parentFolderId).eq('is_trashed', false);
      } else {
        // Root folder (null parent)
        query = query.is('parent_folder_id', null).eq('is_trashed', false);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data ? transformFoldersData(data) : [];
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
}

export async function fetchAllItems(folderId: string | null = null, view: 'all' | 'starred' | 'shared' | 'trash' | 'recent' = 'all') {
  const files = await fetchFiles(folderId, view);
  const folders = await fetchFolders(folderId, view);
  return [...folders, ...files];
}

export async function createFolder(name: string, parentFolderId: string | null = null) {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('folders')
      .insert({
        name,
        parent_folder_id: parentFolderId,
        user_id: userData.user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return transformFolderData(data);
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

export async function starItem(item: FileItem, starred: boolean) {
  try {
    if (item.type === 'folder') {
      const { error } = await supabase
        .from('folders')
        .update({ is_starred: starred })
        .eq('id', item.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('files')
        .update({ is_starred: starred })
        .eq('id', item.id);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error("Error starring item:", error);
    throw error;
  }
}

export async function trashItem(item: FileItem) {
  try {
    if (item.type === 'folder') {
      const { error } = await supabase
        .from('folders')
        .update({ is_trashed: true })
        .eq('id', item.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('files')
        .update({ is_trashed: true })
        .eq('id', item.id);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error("Error trashing item:", error);
    throw error;
  }
}

export async function restoreItem(item: FileItem) {
  try {
    if (item.type === 'folder') {
      const { error } = await supabase
        .from('folders')
        .update({ is_trashed: false })
        .eq('id', item.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('files')
        .update({ is_trashed: false })
        .eq('id', item.id);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error("Error restoring item:", error);
    throw error;
  }
}

export async function deleteItemPermanently(item: FileItem) {
  try {
    if (item.type === 'folder') {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', item.id);
      
      if (error) throw error;
    } else {
      // First delete the file from storage
      if (item.filePath) {
        const { error: storageError } = await supabase.storage
          .from('files')
          .remove([item.filePath]);
        
        if (storageError) throw storageError;
      }
      
      // Then delete the file record
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', item.id);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}

export const shareFile = async (fileId: string, sharedWith: string | null = null, accessLevel: string = 'view', expiresAt: Date | null = null) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('shared_files')
      .insert({
        file_id: fileId,
        shared_by: userData.user.id,
        shared_with: sharedWith,
        access_level: accessLevel,
        expires_at: expiresAt ? expiresAt.toISOString() : null
      });

    if (error) throw error;

    // Safely access data - fix for the TypeScript error
    return { success: true, shareId: data && data[0] ? data[0].id : null };
  } catch (error) {
    console.error('Error sharing file:', error);
    return { success: false, error };
  }
};

export async function uploadFile(file: File, parentFolderId: string | null = null) {
  try {
    // Generate a unique file path to avoid collisions
    const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload the file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('files')
      .upload(filePath, file);
    
    if (storageError) throw storageError;

    // Get current user
    const user = supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    
    // Create a record in the files table
    const { data, error } = await supabase
      .from('files')
      .insert({
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        size: file.size,
        parent_folder_id: parentFolderId,
        user_id: (await user).data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return transformFileData(data);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function downloadFile(fileId: string) {
  try {
    // Get file path from database
    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .select('file_path, name')
      .eq('id', fileId)
      .single();
    
    if (fileError || !fileData) throw fileError || new Error("File not found");
    
    // Get download URL
    const { data, error } = await supabase.storage
      .from('files')
      .download(fileData.file_path);
    
    if (error) throw error;
    
    return { url: URL.createObjectURL(data), fileName: fileData.name };
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

export async function getBreadcrumbPath(folderId: string | null) {
  if (!folderId) return [];
  
  try {
    const breadcrumbs = [];
    let currentFolderId = folderId;
    
    while (currentFolderId) {
      const { data, error } = await supabase
        .from('folders')
        .select('id, name, parent_folder_id')
        .eq('id', currentFolderId)
        .single();
      
      if (error || !data) break;
      
      breadcrumbs.unshift({ 
        id: data.id, 
        name: data.name 
      });
      
      currentFolderId = data.parent_folder_id;
    }
    
    return breadcrumbs;
  } catch (error) {
    console.error("Error fetching breadcrumb path:", error);
    return [];
  }
}

export async function getStorageStats() {
  try {
    const { data: files, error } = await supabase
      .from('files')
      .select('size, file_type')
      .eq('is_trashed', false);
    
    if (error) throw error;
    
    let totalSize = 0;
    const typeBreakdown = {
      documents: 0,
      images: 0,
      videos: 0,
      other: 0,
    };
    
    if (files) {
      files.forEach(file => {
        const size = file.size || 0;
        totalSize += size;
        
        const fileType = file.file_type || '';
        if (fileType.includes('image')) {
          typeBreakdown.images += size;
        } else if (fileType.includes('video')) {
          typeBreakdown.videos += size;
        } else if (
          fileType.includes('pdf') ||
          fileType.includes('doc') ||
          fileType.includes('sheet') ||
          fileType.includes('text') ||
          fileType.includes('presentation')
        ) {
          typeBreakdown.documents += size;
        } else {
          typeBreakdown.other += size;
        }
      });
    }
    
    return {
      usedStorage: totalSize,
      totalStorage: 15 * 1024 * 1024 * 1024, // 15 GB
      breakdown: [
        { label: "Documents", size: typeBreakdown.documents, color: "#8B5CF6" },
        { label: "Images", size: typeBreakdown.images, color: "#3B82F6" },
        { label: "Videos", size: typeBreakdown.videos, color: "#10B981" },
        { label: "Other", size: typeBreakdown.other, color: "#F59E0B" },
      ],
    };
  } catch (error) {
    console.error("Error getting storage stats:", error);
    
    // Return default stats on error
    return {
      usedStorage: 0,
      totalStorage: 15 * 1024 * 1024 * 1024, // 15 GB
      breakdown: [
        { label: "Documents", size: 0, color: "#8B5CF6" },
        { label: "Images", size: 0, color: "#3B82F6" },
        { label: "Videos", size: 0, color: "#10B981" },
        { label: "Other", size: 0, color: "#F59E0B" },
      ],
    };
  }
}

// Helper functions to transform database data to the FileItem format
function transformFilesData(files: any[]): FileItem[] {
  return files.map(transformFileData);
}

function transformFileData(file: any): FileItem {
  return {
    id: file.id,
    name: file.name,
    type: "file",
    fileType: file.file_type,
    size: file.size,
    createdAt: file.created_at,
    updatedAt: file.updated_at,
    starred: file.is_starred,
    shared: file.shared,
    filePath: file.file_path,
  };
}

function transformFoldersData(folders: any[]): FileItem[] {
  return folders.map(transformFolderData);
}

function transformFolderData(folder: any): FileItem {
  return {
    id: folder.id,
    name: folder.name,
    type: "folder",
    createdAt: folder.created_at,
    updatedAt: folder.updated_at,
    starred: folder.is_starred,
    shared: folder.shared,
    parentFolderId: folder.parent_folder_id,
  };
}

export async function searchFiles(searchTerm: string) {
  try {
    // Search in files
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .eq('is_trashed', false);
    
    if (filesError) throw filesError;
    
    // Search in folders
    const { data: folders, error: foldersError } = await supabase
      .from('folders')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .eq('is_trashed', false);
    
    if (foldersError) throw foldersError;
    
    return {
      files: files ? transformFilesData(files) : [],
      folders: folders ? transformFoldersData(folders) : [],
    };
  } catch (error) {
    console.error("Error searching files:", error);
    return { files: [], folders: [] };
  }
}
