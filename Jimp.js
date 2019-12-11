const Jimp = require('jimp');
 
const resize256 = (image) => {
  return Jimp.read(image).then(lenna => {
    const newImg = image.replace('.jpg','_256.jpg');
    return lenna
      .resize(256, Jimp.AUTO) // resize
      .write(newImg); // save
  }).catch (e => {
    console.log(e);
  });

}

module.exports = {
  resize256,
}