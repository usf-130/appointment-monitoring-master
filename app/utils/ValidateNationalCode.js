export function ValidateNationalCode(code) {
  const nationalCodeRegex = /^[0-9]{10}$/;

  if (!nationalCodeRegex.test(code)) {
    return false;
  }

  const check = parseInt(code[9], 10);
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i], 10) * (10 - i);
  }

  const remainder = sum % 11;

  return (
    (remainder < 2 && check === remainder) ||
    (remainder >= 2 && check === 11 - remainder)
  );
}
