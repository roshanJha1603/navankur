class CaptureError extends Error {
  constructor(message, error) {
    super(message);

    // assign the error class name in your custom error (as a shortcut)
    this.name = this.constructor.name;

    // capture the error
    this.error = error;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // additional properties to your error
    // set capture error status
    this.status = 404;
  }
}

module.exports = CaptureError;
