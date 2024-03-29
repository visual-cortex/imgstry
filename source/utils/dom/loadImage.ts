interface ImageConstructor {
    new(): HTMLImageElement
}

/**
 * Promise based image loader
 * @param ImageCtor the constructor reference
 * @param src the image source url
 * @returns a promise that resolves in the associated image element
 */
export const loadImage =
    (ImageCtor: ImageConstructor, src: string): Promise<HTMLImageElement> =>
        new Promise((res, rej) => {
            const image: HTMLImageElement = new ImageCtor();
            image.crossOrigin = 'Anonymous';

            image.onload = () => res(image);
            image.onerror = (err) => rej(err);

            image.src = src;
        });
