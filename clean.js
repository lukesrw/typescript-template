const fs = require("fs");
const path = require("path");

/**
 * @param {string} file name
 * @param {Array} files in directory
 * @returns {boolean} is compiled or not
 */
function isCompiledFile(file, files) {
    let file_no_suffix = file.substring(0, file.lastIndexOf("."));
    let file_no_suffix_again = file_no_suffix.substring(0, file_no_suffix.lastIndexOf("."));

    /**
     * TypeScript filter
     */
    if (
        file.endsWith(".d.ts") ||
        file.endsWith(".d.ts.map") ||
        file.endsWith(".js.map") ||
        (file.endsWith(".js") &&
            files.includes(`${file}.map`) &&
            files.includes(`${file_no_suffix}.d.ts`) &&
            files.includes(`${file_no_suffix}.d.ts.map`))
    ) {
        return true;
    }

    /**
     * SCSS filter
     */
    return (
        (file.endsWith(".css") &&
            (files.includes(`${file_no_suffix}.scss`) || files.includes(`_${file_no_suffix}.scss`))) ||
        (file.endsWith(".css.map") &&
            (files.includes(`${file_no_suffix_again}.scss`) || files.includes(`_${file_no_suffix_again}.scss`)))
    );
}

/**
 * @param {Array} source to target
 * @returns {void}
 */
async function clean(source = []) {
    try {
        let clean_items = await fs.promises.readdir(path.join(...source));
        let clean_items_unlinked = 0;

        for (let index = 0; index < clean_items.length; index += 1) {
            let clean_item_path = path.join(...source.concat(clean_items[index]));
            let clean_item_stats = await fs.promises.stat(clean_item_path);
            if (clean_item_stats.isDirectory()) {
                if (await clean(source.concat(clean_items[index]))) {
                    clean_items_unlinked += 1;
                }
            }
            if (clean_item_stats.isFile() && isCompiledFile(clean_items[index], clean_items)) {
                await fs.promises.unlink(clean_item_path);
                clean_items_unlinked += 1;
            }
        }

        if (clean_items_unlinked === clean_items.length) {
            await fs.promises.rmdir(path.join(...source));

            return true;
        }
    } catch (_1) {}

    return false;
}

clean([__dirname, "dist"]);
