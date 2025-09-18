#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'src', 'webamp-bundle.js');
const backupPath = bundlePath + '.backup';

// Your custom tracks
const customTracks = [
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753891932/01_Gross_Excalations_v3.mp3",
    duration: 68.784,
    metaData: { title: "Gross Excelations", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753891952/02_Two_Travelers_v3.mp3", 
    duration: 208.152,
    metaData: { title: "Two Travelers", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753891962/03_Chambers_of_the_Starwatcher_v3.mp3",
    duration: 218.5665,
    metaData: { title: "Chambers of the Starwatcher", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753891972/04_Hibernal_Torment_v3.mp3",
    duration: 216,
    metaData: { title: "Hibernal Torment", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753892009/05_Rats_v3.mp3",
    duration: 233.64,
    metaData: { title: "Rats", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753892029/06_Entrusted_to_Fools_v3.mp3",
    duration: 196.008,
    metaData: { title: "Entrusted to Fools", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753892049/07_Heavy_Load_v3.mp3",
    duration: 192,
    metaData: { title: "Spider Wash", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753893189/08_Crusted_Aucklet_v3.mp3",
    duration: 71.016,
    metaData: { title: "Crusted Aucklet", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753893209/09_Ill_Wind_v3.mp3",
    duration: 216,
    metaData: { title: "Ill Wind", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753893229/10_Breadmaker_v3.mp3",
    duration: 193.824,
    metaData: { title: "Rippler", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753893249/11_Doom_Fruit_v3.mp3",
    duration: 210,
    metaData: { title: "Trapped in a Tree", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753894796/12_Taste_of_my_Chime_v3.mp3",
    duration: 138,
    metaData: { title: "Taste of my Chime", artist: "GATEKEEPER" }
  },
  {
    url: "https://res.cloudinary.com/dtwix3ubl/video/upload/v1753894816/13_Bone_Window_v3.mp3",
    duration: 141.648,
    metaData: { title: "Bone Window", artist: "GATEKEEPER" }
  }
];

function patchBundle() {
  console.log('Reading webamp bundle...');
  
  if (!fs.existsSync(bundlePath)) {
    console.error('Bundle file not found:', bundlePath);
    return;
  }
  
  // Create backup if it doesn't exist
  if (!fs.existsSync(backupPath)) {
    console.log('Creating backup...');
    fs.copyFileSync(bundlePath, backupPath);
  }
  
  let bundleContent = fs.readFileSync(bundlePath, 'utf8');
  
  // Find and replace the default tracks
  // Look for the pattern where tracks are defined
  const llamaPattern = /DJ Mike Llama.*?Llama Whippin.*?Intro/g;
  const matches = bundleContent.match(llamaPattern);
  
  if (matches) {
    console.log('Found', matches.length, 'references to default tracks');
    
    // Replace the track data structure
    // This is a more targeted approach - look for the specific track array structure
    const trackArrayPattern = /\[{[^}]*metaData[^}]*artist[^}]*"DJ Mike Llama"[^}]*title[^}]*"Llama Whippin[^}]*Intro"[^}]*}[^}]*url[^}]*"[^"]*"[^}]*duration[^}]*\d+[^}]*}[^\]]*\]/g;
    
    if (bundleContent.match(trackArrayPattern)) {
      console.log('Found track array pattern, replacing...');
      const customTracksJson = JSON.stringify(customTracks);
      bundleContent = bundleContent.replace(trackArrayPattern, customTracksJson);
    } else {
      // Alternative approach: replace individual track references
      console.log('Track array pattern not found, trying individual replacements...');
      
      // Replace the DJ Mike Llama track specifically
      const llamaTrackPattern = /{[^}]*metaData[^}]*artist[^}]*"DJ Mike Llama"[^}]*title[^}]*"Llama Whippin[^}]*Intro"[^}]*}[^}]*url[^}]*"[^"]*"[^}]*duration[^}]*[\d.]+[^}]*}/g;
      
      if (bundleContent.match(llamaTrackPattern)) {
        console.log('Found individual Llama track, replacing with first custom track...');
        const firstTrack = JSON.stringify(customTracks[0]);
        bundleContent = bundleContent.replace(llamaTrackPattern, firstTrack);
      }
    }
    
    // Write the modified bundle
    fs.writeFileSync(bundlePath, bundleContent);
    console.log('Bundle patched successfully!');
  } else {
    console.log('Default track pattern not found in bundle');
  }
}

function restoreBundle() {
  if (fs.existsSync(backupPath)) {
    console.log('Restoring original bundle...');
    fs.copyFileSync(backupPath, bundlePath);
    console.log('Bundle restored!');
  } else {
    console.log('No backup found');
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--restore')) {
  restoreBundle();
} else {
  patchBundle();
}