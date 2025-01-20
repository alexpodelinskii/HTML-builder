const fs = require('fs');

const path = require('path');

const dir = path.join(__dirname, '/secret-folder');

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err.message);
  }
  const onlyFiles = files.filter(file => file.isFile());
  onlyFiles.forEach(file => {
    getData(file);
  })
})

async function getData(file) {
  const psthToFile = path.join(dir, file.name);
  const fileData = path.parse(psthToFile);
  const stat = fs.promises.stat(psthToFile)
    .then(data => {
      console.log(`${fileData.name} - ${fileData.ext.slice(1)} - ${data.size}b`)
    })


}