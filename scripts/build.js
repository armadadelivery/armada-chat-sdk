const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure lib directory exists
const libDir = path.join(__dirname, '..', 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, {recursive: true});
}

// Function to copy a file
function copyFile(source, destination) {
  try {
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${source} -> ${destination}`);
  } catch (error) {
    console.error(`Error copying file ${source}:`, error);
  }
}

// Function to copy a directory recursively
function copyDirectory(source, destination, excludeExtensions = []) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, {recursive: true});
  }

  // Get all files and directories in the source directory
  const entries = fs.readdirSync(source, {withFileTypes: true});

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    // Skip node_modules and other unnecessary directories
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name.startsWith('.')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively copy directory
      copyDirectory(sourcePath, destPath, excludeExtensions);
    } else {
      // Skip files with excluded extensions
      const ext = path.extname(entry.name).toLowerCase();
      if (excludeExtensions.includes(ext)) {
        continue;
      }
      // Copy file
      copyFile(sourcePath, destPath);
    }
  }
}

try {
  // Run TypeScript compiler
  console.log('Compiling TypeScript...');
  execSync('npx tsc --project tsconfig.json', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });

  // Copy non-TypeScript files (images, etc.)
  console.log('Copying assets...');
  const srcImgDir = path.join(__dirname, '..', 'src', 'img');
  const libImgDir = path.join(__dirname, '..', 'lib', 'img');

  // Check if the img directory exists
  if (fs.existsSync(srcImgDir)) {
    // Copy all files from img directory to lib/img directory
    // Exclude TypeScript files as they are already compiled
    copyDirectory(srcImgDir, libImgDir, ['.ts', '.tsx']);
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
