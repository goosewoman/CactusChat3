window.nodeSetImmediate = setImmediate;
setInterval(() => {
  window.nodeSetImmediate(() => {});
}, 1000);
