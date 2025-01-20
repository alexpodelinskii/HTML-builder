const fs = require('fs');

const path = require('path');

const dir = path.join(__dirname, '/styles');


fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err.message);
  }
  if (files.length) {
    const onlyCssFilesArr = files.filter(file => {
      if (file.isFile()) {
        let ext = file.name.split('.')[1]
        return ext == 'css'
      }

    });


    const arrOfStyles = onlyCssFilesArr.map(file => {
      const pathToFile = path.join(dir, file.name)


      return fs.promises.readFile(pathToFile, 'utf-8')
    }
    );


    const bandle = path.join(__dirname, '/project-dist/bundle.css');

    Promise.all(arrOfStyles)
      .then(resolves => {
        const stream = fs.createWriteStream(bandle);
        stream.close();
        resolves.forEach(data => {

          return fs.promises.appendFile(bandle, data + '\n');
        })
      }




      )
      .catch(err => {
        console.log(err);
      })

  } else {
    console.log('Directory with styles is empty');
  }

})