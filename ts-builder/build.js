#!/usr/bin/env node
"use strict";

const { ConsoleLogger } = require('@moe-tech/policysystem');
const logger = new ConsoleLogger();
const fs = require('fs');
const { build } = require("esbuild");
const { dependencies, peerDependencies } = require('./package.json');
const { Generator } = require('npm-dts');
const { execSync } = require('child_process');
const path = require('path');

(async function main() {
  try {
    logger.log('Starting build process...', 'INFO');
    // print the contents of the directory
    logger.log(`Current Working Directory: ${process.cwd()}`, 'INFO');
    
    // log all the files in the current directory
    const files = fs.readdirSync(process.cwd());
    logger.log(`Files in current directory: ${files}`, 'INFO');
    logger.log(`Dependencies: ${JSON.stringify(dependencies)}`, 'INFO');
    logger.log(`Peer Dependencies: ${JSON.stringify(peerDependencies)}`, 'INFO');

    
    // Ensure "dist" folder exists; create it if not
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    if(fs.existsSync('index.ts')) {
    
      // Generate TypeScript declaration files
      await new Generator({
        entry: 'index.ts',
        output: 'dist/index.d.ts'
      }).generate()
      logger.log('Generated TypeScript declaration files.', 'INFO');

      const sharedConfig = {
        entryPoints: ["index.ts"],
        bundle: true,
        minify: true,
        external: Object.keys(dependencies || {}).concat(Object.keys(peerDependencies || {})),
      };
      logger.log(`Shared Config: ${JSON.stringify(sharedConfig)}`, 'INFO');

      await build({
        ...sharedConfig,
        platform: 'node',
        outfile: "dist/index.js"
      });
      logger.log('Build process for index.js completed.', 'INFO');
    }

    // Copy package.json and package-lock.json into dist
    fs.copyFileSync('package.json', 'dist/package.json');
    fs.copyFileSync('package-lock.json', 'dist/package-lock.json');
    logger.log('Copied package.json and package-lock.json to dist.', 'INFO');

    // Execute npm ci for production dependencies in the "dist" folder
    execSync('npm ci --omit=dev', { cwd: 'dist', stdio: 'inherit' });

    logger.log('Build process completed successfully.', 'INFO');
  } catch (error) {
    logger.log(`Build process failed: ${JSON.stringify(error.message)}`, 'ERROR');
    process.exit(1);
  }
})();

