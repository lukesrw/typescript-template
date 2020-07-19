/**
 * Node.js modules
 */
import { promises } from "fs";
import { join } from "path";

async function toDist(source: string[] = []) {
    let src_directory = join(__dirname, "..", "..", "src", ...source);
    let src_files: string[] = await promises.readdir(src_directory);

    let dist_directory = join(__dirname, ...source);
    try {
        await promises.stat(dist_directory);
    } catch (ignore) {
        await promises.mkdir(dist_directory);
    }

    src_files.forEach(async src_file => {
        let src_file_stats = await promises.stat(join(src_directory, src_file));

        if (src_file_stats.isDirectory()) {
            return await toDist(source.concat(src_file));
        }

        if (src_file_stats.isFile() && !src_file.endsWith(".ts")) {
            return await promises.copyFile(join(src_directory, src_file), join(dist_directory, src_file));
        }
    });
}

toDist();
