function logger(req, res, next) {
  console.log('--- Logger Middleware ---');
  console.log(`${req.method} ${req.path} — ${new Date().toISOString()}`);
  next(); // MUST call next, or request hangs
}
module.exports = logger;
