const fs = require('fs');

const path = require('path');

const distDir = path.join(__dirname, '/project-dist');

fs.mkdir(distDir, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  };
});

// create HTML file
const newHtmlFile = path.join(distDir, 'index.html');
const layoutPath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');

const reg = /\{\{(.+?)\}\}/g;

let html = '';

const htmlStream = fs.ReadStream(layoutPath, { encoding: 'utf-8' })
htmlStream.on('data', data => {
  html = data;
})


fs.readdir(componentsDir, (err, files) => {
  if (err) console.log(err);
  const index = {}
  const components = []
  files.forEach((file, ind) => {
    const pathToFile = path.join(componentsDir, file);
    const name = file.split('.')[0];
    index[name] = ind;
    components[ind] = fs.promises.readFile(pathToFile, { encoding: 'utf-8' });



  })
  Promise.all(components)
    .then(resolves => {
      html = html.replace(reg, (match0, match1) => resolves[index[match1]]);

      const stream = fs.WriteStream(newHtmlFile);
      stream.write(html)




    }
    )
    .catch(err => {
      console.log(err);
    })
})

//--------------------------------------------------------------------------------------------------










//copy assets
copyDir(path.join(__dirname, '/assets'), path.join(distDir, '/assets'))


function copyDir(dir, newDir) {



  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err.message);
    }
    fs.stat(newDir, function (err) {
      if (!err) {
        fs.readdir(newDir, (err, filesCopy) => {
          if (err) {
            console.error(err.message);
          }
          const fileArr = []
          files.forEach(file => {
            fileArr.push(file.name)
          })

          filesCopy.forEach(file => {

            if (fileArr.findIndex(el => el === file) === -1) {

              fs.unlink(path.join(newDir, file), err => {
                if (err) throw err;
              });
            }
          })



        });


      }

    });













    fs.mkdir(newDir, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      };
    });










    files.forEach(file => {
      const pathToFile = path.join(dir, file.name)
      const pathToCopyFile = path.join(newDir, file.name);

      if (file.isFile()) {
        fs.copyFile(pathToFile, pathToCopyFile, (err) => {
          if (err) console.log(err);
        })
      } else {

        copyDir(pathToFile, pathToCopyFile)
      }
    })
  })
}
//--------------------------------------------------------------------------------------------------



// create single CSS file 




const cssDir = path.join(__dirname, 'styles');



fs.readdir(cssDir, { withFileTypes: true }, (err, files) => {
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
      const pathToFile = path.join(cssDir, file.name)
      return fs.promises.readFile(pathToFile, 'utf-8')
    }
    );


    const bandle = path.join(distDir, 'style.css');

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