/* global process */

/* jshint node: true */

'use strict';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
    },
];

const projectRoot = process.cwd();
const distDirectory = resolve(projectRoot, 'dist');
const distBundleFile = resolve(projectRoot, 'dist/masonry.js');
const masonrySourceFile = resolve(projectRoot, 'masonry.js');

function splitMasonrySource(source) {
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
}

async function getBundleContents() {
    const sourceContents = await Promise.all(bundleSources.map(async ({ file, name }) => {
        const filePath = resolve(projectRoot, file);
        const content = await readFile(filePath, 'utf8');

        if (!content.trim()) {
            throw new Error(`${name} source file is empty: ${filePath}`);
        }

        return content.trimEnd();
    }));

    const masonrySource = await readFile(masonrySourceFile, 'utf8');
    const { banner, runtime } = splitMasonrySource(masonrySource);

    return `${[banner, ...sourceContents, runtime].filter(Boolean).join('\n\n')}\n`;
}

async function buildBundle() {
    await mkdir(distDirectory, { recursive: true });

    const bundleContents = await getBundleContents();

    await writeFile(distBundleFile, bundleContents, 'utf8');

    console.log(`Created ${distBundleFile} from ${bundleSources.length + 1} source files.`);
}

buildBundle()
    .then(() => console.log('Bundle build complete.'))
    .catch(err => {
        console.error('Error building bundle:', err);
        process.exit(1);
    });
