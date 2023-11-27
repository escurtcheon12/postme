class InternalServerError extends Error {
  constructor(message, status) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message || "Internal Server Error";
    this.status = status || 500;
  }
}

class NotFoundException extends InternalServerError {
  constructor(message) {
    super(message || "Not Found.", 404);
  }
}

class BadRequestException extends InternalServerError {
  constructor(message) {
    super(message || "Bad Request", 400);
  }
}

class UnauthorizedException extends InternalServerError {
  constructor(message) {
    super(message || "Unauthorized", 401);
  }
}

module.exports = {
  InternalServerError,
  NotFoundException,
  BadRequestException,
  UnauthorizedException
};
