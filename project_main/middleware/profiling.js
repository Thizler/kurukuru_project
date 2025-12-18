// middleware/profiler.js
module.exports = function profiler(req, res, next) {
    const start = process.hrtime();
  
    res.on('finish', () => {
      const [sec, nano] = process.hrtime(start);
      const timeInMs = (sec * 1e3 + nano / 1e6).toFixed(2);
  
      console.log(`[${req.method}] ${req.originalUrl} - ${timeInMs} ms`);
    });
  
    next();
  };
  