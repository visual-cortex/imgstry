interface ImageConstructor {
  new(): HTMLImageElement;
}

export const loadImage =
  (ImageCtor: ImageConstructor, src: string): Promise<HTMLImageElement> =>
    new Promise((res, rej) => {
      const image: HTMLImageElement = new ImageCtor();

      image.onload = () => res(image);
      image.onerror = (err) => rej(image);

      image.src = src;
    });
