import { WorkerOptions } from '../interfaces';

const workerOptions: WorkerOptions = {
  workerSrc: 'workerpool-functions.js',
  workerPoolOptions: undefined,
} as const;

export default workerOptions;
