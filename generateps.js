import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateFolderStructure(dirPath, prefix = "") {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let structure = "";

  entries.forEach((entry, index) => {                  
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const entryPath = path.join(dirPath, entry.name);

    // Skip node_modules and .git directories
    if (entry.name === 'node_modules' || entry.name === '.git') return;

    structure += `${prefix}${connector}${entry.name}\n`;

    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      structure += generateFolderStructure(entryPath, newPrefix);
    }
  });

  return structure;
}

function updateProjectStructureFile() {
  const rootDir = path.resolve(__dirname);
  const outputPath = path.join(rootDir, "project_structure.txt");

  // Read existing content
  let existingContent = "";
  if (fs.existsSync(outputPath)) {
    existingContent = fs.readFileSync(outputPath, 'utf8');
  }

  // Generate new structure
  const newStructure = generateFolderStructure(rootDir);

  // Find the position to insert the new structure
  const insertPosition = existingContent.indexOf("D:.");
  if (insertPosition !== -1) {
    // Replace the old structure with the new one
    const updatedContent = existingContent.slice(0, insertPosition) + newStructure;
    fs.writeFileSync(outputPath, updatedContent);
  } else {
    // If the file doesn't contain the expected structure, append the new one
    fs.writeFileSync(outputPath, existingContent + "\n" + newStructure);
  }

  console.log("✅ Project structure updated in project_structure.txt");
}

updateProjectStructureFile();
