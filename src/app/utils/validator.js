import { todayDate } from "./date";

const validatorConfig = {
  email: {
    isRequired: { message: "Email is required" },
    isEmail: { message: "This is not Email" }
  },
  password: {
    isRequired: { message: "Password is required" },
    isCapitalSymbol: { message: "Password must contain capital letter" },
    isSmallSymbol: { message: "Password must contain small letter" },
    isContainDigit: { message: "Password must contain number" },
    min: { message: "Password must contain at least 8 symbols", value: 8 }
  },
  name: {
    isRequired: { message: "Name is required" }
  },
  surname: {
    isRequired: { message: "Surname is required" }
  },
  passwordConfirm: {
    isRequired: { message: "Password is required" },
    isEqual: { message: "Must equal your password" }
  },
  amount: {
    isRequired: { message: "Amount is required" },
    isPositive: { message: "Amount must be positive" }
  },
  date: {
    isNotFuture: { message: "Date can not be more than today" },
    isRequired: { message: "Date is required" }
  }
};

export function validator(data, config = validatorConfig) {
  const errors = {};

  function validate(validateMethod, data, config, allData = {}) {
    let statusValidate;

    switch (validateMethod) {
      case "isRequired":
        statusValidate = data.trim() === "";

        break;

      case "isEmail": {
        const emailRegExp = /^\S+@\S+\.\S+$/g;
        statusValidate = !emailRegExp.test(data);

        break;
      }

      case "isCapitalSymbol": {
        const capitalRegExp = /[A-Z]+/g;
        statusValidate = !capitalRegExp.test(data);

        break;
      }

      case "isSmallSymbol": {
        const smallRegExp = /[a-z]+/g;
        statusValidate = !smallRegExp.test(data);

        break;
      }

      case "isContainDigit": {
        const digitRegExp = /\d+/g;
        statusValidate = !digitRegExp.test(data);

        break;
      }

      case "min": {
        statusValidate = data.length < config.value;

        break;
      }

      case "isEqual": {
        statusValidate = data !== allData.password;

        break;
      }

      case "isPositive": {
        statusValidate = data <= 0;

        break;
      }

      case "isNotFuture": {
        statusValidate = data > todayDate();

        break;
      }

      case "noAccount": {
        statusValidate = !data;

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

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
