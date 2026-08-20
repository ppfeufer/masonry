/* global process */

/* jshint node: true */

'use strict';

import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

// Sources to bundle together, in order. The last source is the Masonry runtime.
const bundleSources = [
    {
        name: 'jQuery Bridget',
        file: 'node_modules/jquery-bridget/jquery-bridget.js'
    },
    {
        name: 'EvEmitter',
        file: 'node_modules/ev-emitter/ev-emitter.js'
    },
    {
        name: 'getSize',
        file: 'node_modules/get-size/get-size.js'
    },
    {
        name: 'matchesSelector',
        file: 'node_modules/desandro-matches-selector/matches-selector.js'
    },
    {
        name: 'Fizzy UI Utils',
        file: 'node_modules/fizzy-ui-utils/utils.js'
    },
    {
        name: 'Outlayer Item',
        file: 'node_modules/outlayer/item.js'
    },
    {
        name: 'Outlayer',
        file: 'node_modules/outlayer/outlayer.js'
    }
];

const projectRoot = process.cwd();
const distDirectory = resolve(projectRoot, 'dist');
const distBundleFile = resolve(projectRoot, 'dist/masonry.js');
const masonrySourceFile = resolve(projectRoot, 'src/masonry.js');

// Guard to prevent duplicate loading of the Masonry bundle in the global scope.
const bundleLoadGuardOpen = `((globalObject) => {
    'use strict';

    if (globalObject.__ppfeuferMasonryLoaded__) {
        console.warn('Masonry bundle already loaded. Skipping duplicate load.');

        return;
    }

    Object.defineProperty(globalObject, '__ppfeuferMasonryLoaded__', {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false
    });

`;
const bundleLoadGuardClose = `
})(typeof globalThis !== 'undefined' ? globalThis : window);
`;

/**
 * Splits the Masonry source file into a banner and runtime section.
 *
 * @param {string} source - The masonry.js source file content.
 * @returns {{banner: string, runtime: string}|{banner: string, runtime: string}}
 */
const splitMasonrySource = (source) => {
    const masonrySectionMarker = '/**\n * Masonry';
    const masonrySectionIndex = source.indexOf(masonrySectionMarker);

    if (masonrySectionIndex === -1) {
        return {
            banner: '',
            runtime: source.trimEnd()
        };
    }

    return {
        banner: source.slice(0, masonrySectionIndex).trimEnd(),
        runtime: source.slice(masonrySectionIndex).trimEnd()
    };
};

/**
 * Reads the contents of all source files and combines them into a single string.
 *
 * @returns {Promise<string>}
 */
const getBundleContents = async () => {
    const sourceContents = await Promise.all(bundleSources.map(async ({file, name}) => {
        const filePath = resolve(projectRoot, file);
        const content = await readFile(filePath, 'utf8');

        if (!content.trim()) {
            throw new Error(`${name} source file is empty: ${filePath}`);
        }

        return content.trimEnd();
    }));

    const masonrySource = await readFile(masonrySourceFile, 'utf8');
    const {banner, runtime} = splitMasonrySource(masonrySource);

    return `${bundleLoadGuardOpen}${[banner, ...sourceContents, runtime].filter(Boolean).join('\n\n')}${bundleLoadGuardClose}`;
};

/**
 * Builds the bundle by reading source files, combining them, and writing to the dist directory.
 *
 * @returns {Promise<void>}
 */
const buildBundle = async () => {
    await mkdir(distDirectory, {recursive: true});

    const bundleContents = await getBundleContents();

    await writeFile(distBundleFile, bundleContents, 'utf8');

    console.log(`Created ${distBundleFile} from ${bundleSources.length + 1} source files.`);
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
