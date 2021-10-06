import { WorkerPoolOptions } from 'workerpool';

export type WorkerOptions = {
  workerSrc: string;
  workerPoolOptions?: WorkerPoolOptions;
};
