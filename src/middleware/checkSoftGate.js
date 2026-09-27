const checkSoftGate = (req, res, next) => {
  const userHeader = req.headers['x-mock-user'];

  if (!userHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let user;
  try {
    user = JSON.parse(userHeader);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (user.verification_status === 'PENDING') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};

module.exports = checkSoftGate;
