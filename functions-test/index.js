exports.helloWorld = (req, res) => {
  const userAgent = req.headers['user-agent'];
  console.log(`userAgent: ${userAgent}`);
  res.send('Hello, World');
};
