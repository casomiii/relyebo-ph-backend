const app = require('./app');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 RELYEBO PH backend listening on http://${HOST}:${PORT}`);
});
