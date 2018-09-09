import { OperationOption } from './types/index';

export interface IThreadData extends IThreadResult {
  operations: OperationOption[];
}

export interface IThreadResult {
  imageData: ImageData;
}

export interface ImgstryThread {
  run({
    imageData,
    operations,
  }: IThreadData): Promise<IThreadResult>;
}
