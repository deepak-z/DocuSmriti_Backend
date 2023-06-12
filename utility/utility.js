import constant from "../constants/constant.js";

export function maskAadhaarNumber(aadhaarNumber) {
  if (aadhaarNumber.length != 12) {
    return ["Aadhaar Number length is not equal to 12", "INVALID_INPUT"];
  }

  const lastFourDigits = aadhaarNumber.slice(-4);
  const maskedAadhaarNumber = "XXXXXXXX" + lastFourDigits;

  return [maskedAadhaarNumber, null];
}

//TODO: UTC time fix
export function validateDOB(dob) {
  if (dob.match(constant.DATE_REGEX) === null) {
    return false;
  }

  const [day, month, year] = dob.split("/");
  const date = new Date(year, month - 1, day);

  return (
    date.getDate() == day &&
    date.getMonth() == month - 1 &&
    date.getFullYear() == year
  );
}

export function validateGender(gender){
  return (
    gender == "M" ||
    gender == "F" ||
    gender == "T" //TODO Needs to be checked with Zoop.One Team
  )
}

//TODO: UTC time check
export function getAge(date){
  const [day, month, year] = date.split('/');
  const birthDate = new Date(year, month - 1, day);
  var millisecondsDifference = Date.now() - birthDate;

  return Math.floor(millisecondsDifference/constant.MILLISECONDS_IN_A_YEAR);
}

export function nameMatch(name1, name2){
  name1 = name1.replace(constant.WHITESPACE_REGEX,'')
  name2 = name2.replace(constant.WHITESPACE_REGEX,'')
  return name1.toLowerCase() == name2.toLowerCase()
}