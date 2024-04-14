const parsePhoneNumber = require('libphonenumber-js');
const random = require('random');

const parseCommonPhone = (phone) => {
  //TODO : Parse phone to use in common
  // Parse phone
  const country_code = 'VN';
  const phoneNumber = parsePhoneNumber(phone, country_code);

  // Return type +84.........
  return (phoneNumber && phoneNumber.number) ? phoneNumber.number : phone;
}

const isValidId = (id) => {
  return !!id && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/);
}

const isValidEmail = (email) => {
  return !!email && typeof email === 'string' && email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
}

const isValidPhonenumber = (phone) => {
  return !!phone && typeof phone === 'string' && phone.match(/^(0|\+84)([3|5|7|8|9])+([0-9]{8})$/g);
}

const isValidCountryCode = (countryCode) => {
  return !!countryCode && typeof countryCode === 'string' && countryCode.match(/^\+?\d+$/);
}

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const isValidPassword = (password) => {
  return (/^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*[0-9])(?=.*[a-z]).{6,}$/g).test(password);
}

const generateId = () => {
  return 'xxxx-xxxx-4xxx-xxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const randomString = (size, chars) => {
  size = size || 8
  chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charsLength = chars.length + 1
  let newPass = ''
  while (size > 0) {
    newPass += chars.charAt(Math.floor(Math.random() * charsLength))
    size--
  }
  return newPass
}

const hasSpecialChars = (str) => {
  const special_chars = /[`!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
  return special_chars.test(str);
}

const hasVietnameseChar = (str) => {
  const regex = /[đĐ\u0300-\u036f]/g;
  return regex.test(str.normalize('NFD'));
}

const createPaymentId = () => {
  const year = new Date().getFullYear().toString();

  let month = new Date().getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  } else {
    month = month.toString();
  }

  let date = new Date().getDate();
  if (date < 10) {
    date = `0${date}`;
  } else {
    date = date.toString();
  }

  let hour = new Date().getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  } else {
    hour = hour.toString();
  }

  let minute = new Date().getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  } else {
    minute = minute.toString();
  }

  let second = new Date().getUTCSeconds();
  if (second < 10) second = `0${second}`;
  else second = second.toString();

  return `${random.int(100, 999)}${year}${month}${date}${hour}${minute}${second}${random.int(100, 999)}`;;
};

module.exports = {
  parseCommonPhone,
  isValidId,
  isValidPassword,
  isValidEmail,
  isValidPhonenumber,
  isNumeric,
  generateId,
  randomString,
  isValidCountryCode,
  hasSpecialChars,
  hasVietnameseChar,
  createPaymentId
};