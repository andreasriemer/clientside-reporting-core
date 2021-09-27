importScripts('./workerpool.min.js');
importScripts('./clientside-reporting-core.min.js');

workerpool.worker({
  getReport,
  generateReport,
  aggregationPipe,
  pipeFromConfig
});