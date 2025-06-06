const fs = require('fs-extra');
const path = require('path');

async function build() {
  const srcDir = path.join(__dirname, '../src');
  const distDir = path.join(__dirname, '../dist');

  try {
    // Clean dist directory
    await fs.emptyDir(distDir);

    // Copy all files from src to dist
    await fs.copy(srcDir, distDir, {
      filter: (src) => {
        // Skip the loops directory since we're using Cloudinary
        return !src.includes('/loops/');
      }
    });

    // Copy webamp.css to root of dist
    const webampCss = path.join(srcDir, 'webamp.css');
    if (await fs.pathExists(webampCss)) {
      await fs.copy(webampCss, path.join(distDir, 'webamp.css'));
    }

    // Copy root files
    const rootFiles = ['package.json', 'README.md'];
    for (const file of rootFiles) {
      const srcFile = path.join(__dirname, '..', file);
      if (await fs.pathExists(srcFile)) {
        await fs.copy(srcFile, path.join(distDir, file));
      }
    }

    // Update index.html paths for GitHub Pages
    const indexPath = path.join(distDir, 'index.html');
    let indexContent = await fs.readFile(indexPath, 'utf8');
    
    // Update asset paths to be relative
    indexContent = indexContent.replace(/src="\/src\//g, 'src="');
    indexContent = indexContent.replace(/href="\/src\//g, 'href="');
    indexContent = indexContent.replace(/url\('\/src\//g, "url('");
    indexContent = indexContent.replace(/url\("\/src\//g, 'url("');
    
    await fs.writeFile(indexPath, indexContent);

    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build(); 