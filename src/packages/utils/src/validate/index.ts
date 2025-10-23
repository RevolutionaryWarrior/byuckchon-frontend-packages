const emailRegex =
  /^[A-Za-z0-9]([A-Za-z0-9_.+-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
// 하이픈 없는 010으로 시작하는 11자리 숫자
const phoneRegex = /^010(\d{4})(\d{4})$/;
// 한국의 모든 지역번호 (070, 02, 031~039, 041~043, 051~055, 061~064, 070~072)
const homePhoneRegex =
  /^(070|02|031|032|033|034|035|036|037|038|039|041|042|043|051|052|053|054|055|061|062|063|064|070|071|072)[0-9]{3,4}[0-9]{4}$/;
const birthRegex6 = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/;
const birthRegex8 =
  /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
// 영문(대소문자) + 숫자 + 특수문자가 각 1회 이상 입력되어 있고 10자리 이상
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{10,}$/;
// 2020년 이전 주민등록번호
const juminRegexBefore2020 =
  /^d{2}([0]\d|[1][0-2])([0][1-9]|[1-2]\d|[3][0-1])[-]*[1-4]\d{6}$/;
// 2020년생 이후 주민등록번호도 통과 되도록
const juminRegexAfter2020 =
  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/;
const urlRegex =
  /^https?:\/\/(?:[-\w.])+(?:\.[a-zA-Z]{2,})+(?::\d+)?(?:\/[^\s]*)?$/i;
const defaultFileExtensionRegex =
  /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i;

/**
 * 이메일 형식을 검증합니다.
 * @param email - 검증할 이메일 문자열
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 * @example
 * validateEmail('test@example.com') // true
 * validateEmail('invalid-email') // false
 */
export function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}

/**
 * 휴대폰 번호 형식을 검증합니다. (010으로 시작하는 11자리 숫자, 하이픈 없음)
 * @param phone - 검증할 휴대폰 번호 문자열
 * @returns 유효한 휴대폰 번호 형식이면 true, 아니면 false
 * @example
 * validatePhone('01012345678') // true
 * validatePhone('010-1234-5678') // false
 */
export function validatePhone(phone: string): boolean {
  return phoneRegex.test(phone);
}

/**
 * 집 전화번호 형식을 검증합니다. (한국의 모든 지역번호)
 * @param homePhone - 검증할 집 전화번호 문자열
 * @returns 유효한 집 전화번호 형식이면 true, 아니면 false
 * @example
 * validateHomePhone('0212345678') // true
 * validateHomePhone('03112345678') // true
 */
export function validateHomePhone(homePhone: string): boolean {
  return homePhoneRegex.test(homePhone);
}

/**
 * 생년월일 6자리 형식을 검증합니다. (YYMMDD)
 * @param birth - 검증할 생년월일 문자열
 * @returns 유효한 생년월일 형식이면 true, 아니면 false
 * @example
 * validateBirth6('990101') // true
 * validateBirth6('001231') // true
 */
export function validateBirth6(birth: string): boolean {
  return birthRegex6.test(birth);
}

/**
 * 생년월일 8자리 형식을 검증합니다. (YYYYMMDD)
 * @param birth - 검증할 생년월일 문자열
 * @returns 유효한 생년월일 형식이면 true, 아니면 false
 * @example
 * validateBirth8('19990101') // true
 * validateBirth8('20001231') // true
 */
export function validateBirth8(birth: string): boolean {
  return birthRegex8.test(birth);
}

/**
 * 비밀번호 형식을 검증합니다. (영문 대소문자 + 숫자 + 특수문자 각 1회 이상, 10자리 이상)
 * @param password - 검증할 비밀번호 문자열
 * @returns 유효한 비밀번호 형식이면 true, 아니면 false
 * @example
 * validatePassword('MyPassword123!') // true
 * validatePassword('weak') // false
 */
export function validatePassword(password: string): boolean {
  return passwordRegex.test(password);
}

/**
 * 주민등록번호 형식을 검증합니다. (2020년 이전 출생자)
 * @param jumin - 검증할 주민등록번호 문자열
 * @returns 유효한 주민등록번호 형식이면 true, 아니면 false
 * @example
 * validateJuminBefore2020('990101-1234567') // true
 */
export function validateJuminBefore2020(jumin: string): boolean {
  return juminRegexBefore2020.test(jumin);
}

/**
 * 주민등록번호 형식을 검증합니다. (2020년 이후 출생자 포함)
 * @param jumin - 검증할 주민등록번호 문자열
 * @returns 유효한 주민등록번호 형식이면 true, 아니면 false
 * @example
 * validateJuminAfter2020('200101-5234567') // true
 */
export function validateJuminAfter2020(jumin: string): boolean {
  return juminRegexAfter2020.test(jumin);
}

/**
 * 사업자등록번호를 검증합니다.
 * @param number - 검증할 사업자등록번호 문자열 (하이픈 포함 가능)
 * @returns 유효한 사업자등록번호이면 true, 아니면 false
 * @example
 * validateCorporateRegiNumber('123-45-67890') // 유효성 검사 후 결과 반환
 * validateCorporateRegiNumber('1234567890') // 유효성 검사 후 결과 반환
 */
export function validateCorporateRegiNumber(number: string): boolean {
  const numberMap = number
    .replace(/-/gi, "")
    .split("")
    .map((d) => parseInt(d, 10));

  if (numberMap.length === 10) {
    // 모든 자리가 0인 경우는 유효하지 않음
    if (numberMap.every((digit) => digit === 0)) {
      return false;
    }

    const keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let chk = 0;

    // 1~9번째 자리까지 계산
    for (let i = 0; i < 9; i++) {
      chk += keyArr[i] * numberMap[i];
    }

    // 10번째 자리 검증
    const checkDigit = (10 - (chk % 10)) % 10;
    return numberMap[9] === checkDigit;
  }

  return false;
}

/**
 * URL 형식을 검증합니다.
 * @param url - 검증할 URL 문자열
 * @returns 유효한 URL 형식이면 true, 아니면 false
 * @example
 * validateUrl('https://example.com') // true
 * validateUrl('http://example.com/path') // true
 * validateUrl('not-a-url') // false
 */
export function validateUrl(url: string): boolean {
  return urlRegex.test(url);
}

/**
 * 파일의 확장자와 크기를 검증합니다.
 * 지원 확장자: jpg, jpeg, png, gif, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, zip, rar
 * @param file - 검증할 File 객체 또는 파일명 문자열
 * @param maxSizeInMB - 최대 파일 크기 (MB 단위, 기본값: 10MB)
 * @returns 유효한 파일이면 true, 아니면 false
 * @example
 * validateFile(new File(['content'], 'document.pdf'), 5) // true (5MB 이하)
 * validateFile('image.jpg', 10) // true (확장자 검증만)
 */
export function validateFile(
  file: File | string,
  maxSizeInMB: number = 10
): boolean {
  const fileName = typeof file === "string" ? file : file.name;

  if (!defaultFileExtensionRegex.test(fileName)) {
    return false;
  }

  if (file instanceof File) {
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      return false;
    }
  }

  return true;
}
