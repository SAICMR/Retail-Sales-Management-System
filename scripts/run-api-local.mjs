import app from '../api/index.js';

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Local API runner listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
