class InternalServerError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message || "Something went wrong. Please try again.";
    this.status = status || 500;
  }
}

class NotFoundException extends InternalServerError {
  constructor(message) {
    super(message || "Not found.", 404);
  }
}

class BadRequestException extends InternalServerError {
  constructor(message) {
    super(message || "Bad request", 400);
  }
}

module.exports = {
  InternalServerError,
  NotFoundException,
  BadRequestException,
};
