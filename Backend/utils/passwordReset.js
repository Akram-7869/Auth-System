const crypto = require('crypto');

//just genreating a token 
exports.generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


