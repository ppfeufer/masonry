/* global process */

/* jshint node: true */

'use strict';

import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {bundleSources, getBundleContents, projectRoot} from './build-config.js';

const buildDirectory = resolve(projectRoot, 'dist');
const buildBundleFile = resolve(projectRoot, 'dist/masonry.js');

/**
 * Builds the bundle by reading source files, combining them, and writing to the dist directory.
 *
 * @returns {Promise<void>}
 */
const buildBundle = async () => {
    await mkdir(buildDirectory, {recursive: true});

    const bundleContents = await getBundleContents();

    await writeFile(buildBundleFile, bundleContents, 'utf8');

    console.log(`Created ${buildBundleFile} from ${bundleSources.length + 1} source files.`);
};

/**
 * Build the distribution bundle.
 */
buildBundle()
    .then(() => console.log('Bundle build complete.'))
    .catch(err => {
        console.error('Error building bundle:', err);
        process.exit(1);
    });
