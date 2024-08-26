import userConfig from "../backend/src/db/user/user.config";

/**
 * Debounce function - to be called with .bind({args: [...argList]})
 * @param callback
 * @param delay
 * @returns
 */
export function debounce(callback, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
}

/**
 * Checks if the arg string could be a real email
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email: string): boolean {
  return (
    Boolean(
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) && email.length <= userConfig.maxEmailLength
  );
}

export function validatePassword(password: string): boolean {
  return Boolean(
    password.length >= userConfig.minPasswordLength &&
      password.length <= userConfig.maxPasswordLength
  );
}

export function validateUsername(username: string): boolean {
  return Boolean(
    username.length >= userConfig.minUsernameLength &&
      username.length <= userConfig.maxUsernameLength
  );
}
