
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ContentItem, ProfileContent } from './api';

// Define the data directory
// When running from src/, cwd is already the src directory
const DATA_DIR = path.join(process.cwd(), 'data');

export async function fetchContent(section: string): Promise<ContentItem<unknown>[]> {
  try {
    // Standardize section names to folder names
    const folderName = section.toLowerCase();
    const dirPath = path.join(DATA_DIR, folderName);

    if (!fs.existsSync(DATA_DIR)) {
       console.warn(`Data directory not found: ${DATA_DIR}`);
       return [];
    }

    // Handle PROFILE special case (single file)
    if (section === "PROFILE") {
      const profilePath = path.join(DATA_DIR, 'profile', 'main.yml');
      if (fs.existsSync(profilePath)) {
        const content = yaml.load(fs.readFileSync(profilePath, 'utf8')) as ProfileContent;
        return [{
          PK: "PROFILE",
          SK: "MAIN",
          content
        }] as ContentItem<unknown>[];
      }
      return [];
    }

    // Handle other sections (multiple files)
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
      
      const items = files.map(file => {
        const filePath = path.join(dirPath, file);
        const content = yaml.load(fs.readFileSync(filePath, 'utf8'));
        
        // Construct PK/SK based on file content or filename if needed
        return content as ContentItem<unknown>;
      });

      return items;
    }

    return [];
  } catch (error) {
    console.error(`Error fetching ${section}:`, error);
    return [];
  }
}
