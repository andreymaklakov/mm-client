function generateAuthError(message) {
  if (message === "EMAIL_NOT_FOUND" || message === "INVALID_PASSWORD") {
    return "Email or password is incorrect";
  }
  if (message.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
    return "Too many enter attempts try later";
  }

  if (message === "EMAIL_EXISTS") {
    return "User with this Email already exists, || please Log In, or choose another Email.";
  }
  if (message === "INVALID_EMAIL") {
    return "Email is incorrect";
  }
  if (message === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN") {
    return "Please Log Out and Log In again";
  }
}

export default generateAuthError;
