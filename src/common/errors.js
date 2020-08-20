const ERROR_NAMES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PARAM: 'CAN_INVALID_PARAM',
  MISSING_ROLE: 'CAN_MISSING_ROLE',
};

class LibError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

module.exports = {
  LibError,
  ERROR_NAMES
};
