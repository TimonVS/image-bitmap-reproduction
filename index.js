const images = [
  {
    name: 'Image from same origin',
    url: '/img/apple_logo_8.jpg',
    width: 175,
    height: 150,
  },
  {
    name: 'Image from different origin',
    url: 'http://127.0.0.1:8081/img/apple_logo_8.jpg',
    width: 175,
    height: 150,
  },
];

async function fetchImageAsBlob(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
}

async function fetchImage(url, anonymous = false) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject();
    };

    if (anonymous) img.crossOrigin = 'anonymous';
    img.src = url;
  });
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  return [canvas, context];
}

async function draw(image) {
  // Prepare images
  const [blob, img, imgAnonymous] = await Promise.all([fetchImageAsBlob(image.url), await fetchImage(image.url), await fetchImage(image.url, true)]);
  const [blobImageBitmap, imgImageBitmap, imgAnonymousImageBitmap] = await Promise.all([createImageBitmap(blob), createImageBitmap(img), createImageBitmap(imgAnonymous)]);

  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = image.name;
  document.body.appendChild(sectionTitle);

  const labels = ['Blob --> ImageBitmap', 'Image', 'Image --> ImageBitmap', 'Image (crossOrigin=anonymous) --> ImageBitmap'];

  const container1 = document.createElement('div');
  container1.style.display = 'flex';

  // Draw images without explicit dimensions
  [blobImageBitmap, img, imgImageBitmap, imgAnonymousImageBitmap].forEach((x, i) => {
    const [canvas, context] = createCanvas(200, 200);
    canvas.style.border = '2px solid blue';

    context.drawImage(x, 0, 0);

    const container = document.createElement('div');
    const title = document.createElement('h4');
    title.textContent = labels[i];
    const dimensions = document.createElement('p');
    dimensions.textContent = `Dimensions: ${x.width} x ${x.height}`;

    container.appendChild(title);
    container.appendChild(dimensions);
    container.appendChild(canvas);
    container1.appendChild(container);
  });

  const container2 = document.createElement('div');
  container2.style.display = 'flex';

  // Draw images with dimensions (unresized)
  [blobImageBitmap, img, imgImageBitmap, imgAnonymousImageBitmap].forEach((x, i) => {
    const [canvas, context] = createCanvas(200, 200);
    canvas.style.border = '2px solid red';

    context.drawImage(x, 0, 0, image.width, image.height);

    const container = document.createElement('div');
    const title = document.createElement('h4');
    title.textContent = labels[i];
    const dimensions = document.createElement('p');
    dimensions.textContent = `Dimensions: ${x.width} x ${x.height}`;

    container.appendChild(title);
    container.appendChild(dimensions);
    container.appendChild(canvas);
    container2.appendChild(container);
  });

  document.body.appendChild(container1);
  document.body.appendChild(container2);
}

async function main() {
  for (const image of images) {
    await draw(image);
  }
}

main();
