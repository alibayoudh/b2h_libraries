const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

function createZipFile(files, targetFolder, zipFileName, zipExtension) {
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    const outputPath = path.join(targetFolder, zipFileName + zipExtension);



    // Pipe the archive to the response
    archive.pipe(res);

    // Add files to the zip
    files.forEach(file => {
        if (fs.existsSync(file)) {
            archive.file(file, { name: path.basename(file) });
        }
    });

    // Finalize the archive and save it to the specified folder
    const output = fs.createWriteStream(outputPath);
    archive.pipe(output);

    // Handle errors on the archive stream
    archive.on('error', (err) => {
        console.error('Archiver error:', err);
        res.status(500).send('Internal Server Error');
    });

    // Handle errors on the output stream
    output.on('error', (err) => {
        console.error('Output stream error:', err);
        res.status(500).send('Internal Server Error');
    });

    // Listen for the 'close' event on the output stream
    output.on('close', () => {
        console.log(`Zip file saved to: ${outputPath}`);
    });

    // Finalize the archive only once
    archive.finalize();

    // Set the response header to indicate it's a zip file
    return{ message : `Zip file saved to: ${outputPath}`}
}

module.exports = {
  createZipFile
};
