function validator(data, config) {
  const errors = {};

  function validate(validateMethod, data, config, allData = {}) {
    let statusValidate;

    switch (validateMethod) {
      case "isRequired":
        statusValidate = data.trim() === "";

        break;
      case "isEmail": {
        const emailRegExp = /^\S+@\S+\.\S+$/g;
        statusValidate = data ? !emailRegExp.test(data) : false;

        break;
      }

      case "isCapitalSymbol": {
        const capitalRegExp = /[A-Z]+/g;
        statusValidate = data ? !capitalRegExp.test(data) : false;

        break;
      }

      case "isSmallSymbol": {
        const smallRegExp = /[a-z]+/g;
        statusValidate = data ? !smallRegExp.test(data) : false;

        break;
      }

      case "isContainDigit": {
        const digitRegExp = /\d+/g;
        statusValidate = data ? !digitRegExp.test(data) : false;

        break;
      }

      case "min": {
        statusValidate = data ? data.length < config.value : false;

        break;
      }

      case "isEqual": {
        statusValidate = data !== allData.password;

        break;
      }

      default:
        break;
    }

    if (statusValidate) {
      return config.message;
    }
  }

  for (const fieldName in data) {
    for (const validateMethod in config[fieldName]) {
      const error = validate(
        validateMethod,
        data[fieldName],
        config[fieldName][validateMethod],
        data
      );

      if (error && !errors[fieldName]) {
        errors[fieldName] = error;
      }
    }
  }

  return errors;
}

const validatorConfig = {
  email: {
    isRequired: { message: "Email is required" },
    isEmail: { message: "This is not Email" }
  },
  name: {
    isRequired: { message: "Name is required" }
  },
  surname: {
    isRequired: { message: "Surname is required" }
  },
  password: {
    isCapitalSymbol: { message: "Password must contain capital letter" },
    isSmallSymbol: { message: "Password must contain small letter" },
    isContainDigit: { message: "Password must contain number" },
    min: { message: "Password must contain at least 8 symbols", value: 8 }
  },
  passwordConfirm: {
    isEqual: { message: "Must equal your password" }
  }
};

export function validate(data, setErrors, valConfig = validatorConfig) {
  const errors = validator(data, valConfig);

  setErrors(errors);

  return Object.keys(errors).length === 0;
}

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
