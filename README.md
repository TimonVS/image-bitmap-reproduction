## `createImageBitmap` issue reproduction

`createImageBitmap` behaves weirdly with JPEG images with an EXIF orientation other than 1.

## Setup

1. Run `npm install`
2. Run `npm start` to start the server

## Results

### Chrome 106

`Image` --> `ImageBitmap` is cut off when `dWidth` and `dHeight` is provided to `ctx.drawImage`, it's stretched when `dWidth` and `dHeight` is omitted from the `ctx.drawImage`. Additionally, the image dimensions are flipped.

Adding `img.crossOrigin = 'anonymous'` to `fetchImage` seems to resolve the issue.

![](media/chrome_106.png)

### Safari 16.1

`Blob` --> `ImageBitmap` is cut off, and EXIF orientation is not taken into account.

![](media/safari_16.png)

### Firefox 105

Exactly how it should be.

![](media/firefox_105.png)

### Safari Technical Preview 156 (16.4)

Exactly how it should be.

![](media/safari_tp_156.png)
