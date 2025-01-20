const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '/files');
fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err.message);
  }
  if (files.length) {
    const onlyFiles = files.filter(file => file.isFile());
    const copyDir = path.join(__dirname, '/files-copy');

    fs.stat(copyDir, function (err) {
      if (!err) {
        fs.readdir(copyDir, (err, filesCopy) => {
          if (err) {
            console.error(err.message);
          }
          const fileArr = []
          files.forEach(file => {
            fileArr.push(file.name)
          })

          filesCopy.forEach(file => {

            if (fileArr.findIndex(el => el === file) === -1) {

              fs.unlink(path.join(copyDir, file), err => {
                if (err) throw err; // не удалось удалить файл
              });
            }
          })

        });
      }
    });

    fs.mkdir(copyDir, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      };
    });
    onlyFiles.forEach(file => {
      const pathToFile = path.join(dir, file.name)
      const pathToCopyFile = path.join(copyDir, file.name);
      fs.copyFile(pathToFile, pathToCopyFile, (err) => {
        if (err) console.log(err);
      })
    })
  } else {
    console.log('Directory is empty');
  }
})