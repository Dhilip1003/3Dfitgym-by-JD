const mongoose = require('mongoose');

function requireObjectId(req, res, next) {
  const id = req.params.id || req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id format' });
  }
  return next();
}

function pick(source, allowedFields) {
  return allowedFields.reduce((payload, field) => {
    if (source[field] !== undefined) payload[field] = source[field];
    return payload;
  }, {});
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function isSafeUrl(value) {
  return !value || /^(https?:\/\/|\/)[^\s]+$/i.test(value);
}

module.exports = {
  isSafeUrl,
  parseNumber,
  pick,
  requireObjectId
};
