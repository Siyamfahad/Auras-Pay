#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Updating Next.js landing page...');

// Build the Next.js landing page
console.log('📦 Building Next.js landing page...');
exec('cd landingpage && npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error building Next.js landing page:', error);
    return;
  }
  
  console.log('✅ Next.js build completed');
  
  // Copy the built files to frontend/public
  console.log('📂 Copying files to frontend/public...');
  exec('cp -r landingpage/out/* frontend/public/', (error) => {
    if (error) {
      console.error('❌ Error copying files:', error);
      return;
    }
    
    console.log('✅ Landing page updated successfully!');
    console.log('🚀 Your Next.js landing page is now served by the frontend');
  });
}); 