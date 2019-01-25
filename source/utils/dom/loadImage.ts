interface ImageConstructor {
  new(): HTMLImageElement;
}

export /**
   * Promise based image loader
   *
   * @param {ImageConstructor} ImageCtor the constructor reference
   * @param {string} src the image source url
   * @returns {Promise<HTMLImageElement>} a promise that resolves in the associated image element
   */
  const loadImage =
    (ImageCtor: ImageConstructor, src: string): Promise<HTMLImageElement> =>
      new Promise((res, rej) => {
        const image: HTMLImageElement = new ImageCtor();

        image.onload = () => res(image);
        image.onerror = (err) => rej(image);

        image.src = src;
      });
