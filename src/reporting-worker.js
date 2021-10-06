importScripts('./workerpool.min.js', './clientside-reporting-core.full.min.js');

workerpool.worker({
  combinedSourceValueFilter,
  combineSources,
  filterSourcesValues,
  generateReport,
  pipeFromConfig,
});