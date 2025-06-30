const fs = require('fs-extra');
const path = require('path');

async function build() {
  const srcDir = path.join(__dirname, '../src');
  const distDir = path.join(__dirname, '../dist');
  const rootDir = path.join(__dirname, '..');

  try {
    // Clean dist directory
    await fs.emptyDir(distDir);
    console.log('Cleaned dist directory');

    // Copy all files from src to dist
    await fs.copy(srcDir, distDir, {
      filter: (src) => {
        // Skip the loops directory since we're using Cloudinary
        return !src.includes('/loops/');
      }
    });
    console.log('Copied src files to dist');

    // Copy webamp.css from root to dist if it exists
    const rootWebampCss = path.join(rootDir, 'webamp.css');
    if (await fs.pathExists(rootWebampCss)) {
      await fs.copy(rootWebampCss, path.join(distDir, 'webamp.css'));
      console.log('Copied root webamp.css to dist');
    }

    // Copy src webamp.css to dist if it exists (and root doesn't exist)
    const srcWebampCss = path.join(srcDir, 'webamp.css');
    if (await fs.pathExists(srcWebampCss) && !(await fs.pathExists(rootWebampCss))) {
      await fs.copy(srcWebampCss, path.join(distDir, 'webamp.css'));
      console.log('Copied src webamp.css to dist');
    }

    // Copy other necessary root files
    const rootFiles = ['package.json'];
    for (const file of rootFiles) {
      const srcFile = path.join(rootDir, file);
      if (await fs.pathExists(srcFile)) {
        await fs.copy(srcFile, path.join(distDir, file));
        console.log(`Copied ${file} to dist`);
      }
    }

    // Update index.html paths for GitHub Pages deployment
    const indexPath = path.join(distDir, 'index.html');
    if (await fs.pathExists(indexPath)) {
      let indexContent = await fs.readFile(indexPath, 'utf8');
      
      // Fix CSS path - change ./webamp.css to webamp.css  
      indexContent = indexContent.replace(/href="\.\/webamp\.css"/g, 'href="webamp.css"');
      
      // Fix any remaining relative path issues
      indexContent = indexContent.replace(/src="\.\/assets/g, 'src="assets');
      indexContent = indexContent.replace(/href="\.\/assets/g, 'href="assets');
      indexContent = indexContent.replace(/url\('\.\/assets/g, "url('assets");
      indexContent = indexContent.replace(/url\("\.\/assets/g, 'url("assets');
      
      await fs.writeFile(indexPath, indexContent);
      console.log('Updated index.html paths for GitHub Pages');
    }

    console.log('Build completed successfully!');
    
    // List the dist directory contents for debugging
    const distContents = await fs.readdir(distDir);
    console.log('Dist directory contents:', distContents);
    
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build(); 