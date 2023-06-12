export async function maskAadhaarNumber(aadhaarNumber) {
  if (aadhaarNumber.length != 12) {
    return ["Aadhaar Number length is not equal to 12", "INVALID_INPUT"];
  }

  const lastFourDigits = aadhaarNumber.slice(-4);
  const maskedAadhaarNumber = "XXXXXXXX" + lastFourDigits;

  return [maskedAadhaarNumber, null];
}
