try {
    // eslint-disable-next-line
    require("fs").rmdirSync(require("path").join(__dirname, "src"), {
        recursive: true
    });
} catch (e) {}
