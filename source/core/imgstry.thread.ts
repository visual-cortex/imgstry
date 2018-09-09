import { OperationMethod } from './types/index';

export interface IThreadData extends IThreadResult {
  operation: {
    name: OperationMethod,
    value: any,
  };
}

export interface IThreadResult {
  imageData: ImageData;
}

export interface ImgstryThread {
  run({
    imageData,
    operation,
  }: IThreadData): Promise<IThreadResult>;
}
