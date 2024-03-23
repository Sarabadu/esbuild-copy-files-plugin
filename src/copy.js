import fs from 'fs';
import path from 'path';

/**
 * Check if the path is a file.
 * @param {string} str - The path to check.
 * @returns {boolean} - Returns true if the path is a file.
 */
function isPathToFile(str) {
    return !!path.extname(str);
}

/**
 * Ensure that the directory exists.
 * @param {string} dir - The directory to check.
 */
function ensureDirectoryExists(dir) {
    try {
        fs.accessSync(dir);
    } catch {
        fs.mkdirSync(dir, { recursive: true });
    }
}
/**
 * Copy a file synchronously.
 * @param {string} source - The source file path.
 * @param {string} target - The target file path.
 */
function copyFileSync(source, target) {
    if (isPathToFile(target)) {
        const targetDir = path.dirname(target);

        ensureDirectoryExists(targetDir);
        fs.copyFileSync(source, target);
    } else {
        ensureDirectoryExists(target);
        fs.copyFileSync(source, path.join(target, path.basename(source)));
    }
}

/**
 * Copy a folder recursively synchronously.
 * @param {string} source - The source folder path.
 * @param {string} target - The target folder path.
 * @param {boolean} copyWithFolder - Copy the folder with the folder.
 */
function copyFolderRecursiveSync(source, target, copyWithFolder) {
    if (copyWithFolder) {
        const folder = path.join(target, path.basename(source));

        ensureDirectoryExists(folder);

        return copyFolderRecursiveSync(source, folder);
    }

    ensureDirectoryExists(target);

    if (fs.lstatSync(source).isDirectory()) {
        const files = fs.readdirSync(source);

        for (const file of files) {
            const curSource = path.join(source, file);

            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, path.join(target, file));
            } else {
                copyFileSync(curSource, target);
            }
        }
    }
}

/**
 * Perform the copy operation.
 * @param {object} options - The options object.
 * @param {string | string[]} options.source - The source folder path.
 * @param {string | string[]} options.target - The target folder path.
 * @param {boolean} options.copyWithFolder - Copy the folder with the folder.
 */
function performCopy({ source, target, copyWithFolder }) {
    if (Array.isArray(target)) {
        for (const targetItem of target) {
            performCopy({ source, target: targetItem, copyWithFolder });
        }
    } else if (Array.isArray(source) && !Array.isArray(target)) {
        for (const sourceItem of source) {
            performCopy({ source: sourceItem, target, copyWithFolder });
        }
    } else if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isFile()) {
            copyFileSync(source, target);
        } else if (fs.lstatSync(source).isDirectory()) {
            copyFolderRecursiveSync(source, target, copyWithFolder);
        }
    }
}

/**
 * Copy files synchronously.
 * @param {object} options - The options object.
 * @param {string | string[]} options.source - The source folder path.
 * @param {string | string[]} options.target - The target folder path.
 * @param {boolean} options.copyWithFolder - Copy the folder with the folder.
 */
function copy({ source, target, copyWithFolder }) {
    console.log('Copying files...');

    if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true });
    }

    performCopy({ source, target, copyWithFolder });

    console.log('Files copied.');
}

export default copy;
