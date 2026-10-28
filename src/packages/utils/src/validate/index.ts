// 도메인은 라벨(영문/숫자/하이픈, 양끝 하이픈 불가)을 점으로 여러 번 이을 수 있다. (a.co.kr, mail.example.com)
const emailRegex =
  /^[A-Za-z0-9]([A-Za-z0-9_.+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
// 하이픈 없는 010으로 시작하는 11자리 숫자
const phoneRegex = /^010(\d{4})(\d{4})$/;
// 한국의 지역번호 (02, 031~033, 041~044, 051~055, 061~064) + 인터넷전화(070~072)
const homePhoneRegex =
  /^(02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064|070|071|072)[0-9]{3,4}[0-9]{4}$/;
const birthRegex6 = /^(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
const birthRegex8 = /^(19\d{2}|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
// 영문(대소문자) + 숫자 + 특수문자가 각 1회 이상 입력되어 있고 10자리 이상
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`\-={}[\]:;"'<>,.?/\\]).{10,}$/;
// 2020년 이전 주민등록번호
const juminRegexBefore2020 =
  /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])-?[1-4]\d{6}$/;
// 2020년생 이후 주민등록번호도 통과 되도록
const juminRegexAfter2020 =
  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/;
const urlRegex =
  /^https?:\/\/(?:[-\w.])+(?:\.[a-zA-Z]{2,})+(?::\d+)?(?:\/[^\s]*)?$/i;
/** validate.file 의 기본 허용 확장자 */
export const DEFAULT_FILE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "heic",
  "heif",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "zip",
  "rar",
] as const;

/**
 * 실제로 존재하는 날짜인지 확인합니다. (2/30, 4/31, 평년 2/29 등 거부)
 * @param month - 1~12
 */
function isExistingDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * 이메일 형식을 검증합니다.
 * @param email - 검증할 이메일 문자열
 * @returns 유효한 이메일 형식이면 true, 아니면 false
 * @example
 * validateEmail('test@example.com') // true
 * validateEmail('user@mail.co.kr') // true
 * validateEmail('invalid-email') // false
 */
function validateEmail(email: string): boolean {
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
function validatePhone(phone: string): boolean {
  return phoneRegex.test(phone);
}

/**
 * 집 전화번호 형식을 검증합니다. (한국의 모든 지역번호)
 * @param homePhone - 검증할 집 전화번호 문자열
 * @returns 유효한 집 전화번호 형식이면 true, 아니면 false
 * @example
 * validateHomePhone('0212345678') // true
 * validateHomePhone('03112345678') // true
 * validateHomePhone('0441234567') // true (세종)
 * validateHomePhone('0341234567') // false (없는 지역번호)
 */
function validateHomePhone(homePhone: string): boolean {
  return homePhoneRegex.test(homePhone);
}

/**
 * 생년월일 6자리 형식을 검증합니다. (YYMMDD)
 * @param birth - 검증할 생년월일 문자열
 * @returns 유효한 생년월일 형식이면 true, 아니면 false
 * @example
 * validateBirth6('990101') // true
 * validateBirth6('001231') // true
 * validateBirth6('990230') // false (존재하지 않는 날짜)
 * validateBirth6('a990101') // false
 */
function validateBirth6(birth: string): boolean {
  const match = birthRegex6.exec(birth);
  if (!match) return false;

  const [, yy, mm, dd] = match;
  // 세기를 알 수 없으므로 2000년대 기준으로 윤년을 판단한다. (00년은 2000년으로 보아 2/29 허용)
  return isExistingDate(2000 + Number(yy), Number(mm), Number(dd));
}

/**
 * 생년월일 8자리 형식을 검증합니다. (YYYYMMDD)
 * @param birth - 검증할 생년월일 문자열
 * @returns 유효한 생년월일 형식이면 true, 아니면 false
 * @example
 * validateBirth8('19990101') // true
 * validateBirth8('20001231') // true
 * validateBirth8('19990001') // false (00월)
 * validateBirth8('20230229') // false (평년 2/29)
 */
function validateBirth8(birth: string): boolean {
  const match = birthRegex8.exec(birth);
  if (!match) return false;

  const [, yyyy, mm, dd] = match;
  return isExistingDate(Number(yyyy), Number(mm), Number(dd));
}

/**
 * 비밀번호 형식을 검증합니다. (영문 대소문자 + 숫자 + 특수문자 각 1회 이상, 10자리 이상)
 * @param password - 검증할 비밀번호 문자열
 * @returns 유효한 비밀번호 형식이면 true, 아니면 false
 * @example
 * validatePassword('MyPassword123!') // true
 * validatePassword('weak') // false
 */
function validatePassword(password: string): boolean {
  return passwordRegex.test(password);
}

/**
 * 주민등록번호 형식을 검증합니다. (2020년 이전 출생자)
 * @param jumin - 검증할 주민등록번호 문자열
 * @returns 유효한 주민등록번호 형식이면 true, 아니면 false
 * @example
 * validateJuminBefore2020('990101-1234567') // true
 */
function validateJuminBefore2020(jumin: string): boolean {
  return juminRegexBefore2020.test(jumin);
}

/**
 * 주민등록번호 형식을 검증합니다. (2020년 이후 출생자 포함)
 * @param jumin - 검증할 주민등록번호 문자열
 * @returns 유효한 주민등록번호 형식이면 true, 아니면 false
 * @example
 * validateJuminAfter2020('200101-5234567') // true
 */
function validateJuminAfter2020(jumin: string): boolean {
  return juminRegexAfter2020.test(jumin);
}

/**
 * 대한민국 사업자등록번호를 유효성을 검증합니다. (국세청 공식 알고리즘)
 * @param number - 검증할 사업자등록번호 문자열 (하이픈 포함 가능)
 * @returns 유효한 사업자등록번호이면 true, 아니면 false
 */
function validateCorporateRegiNumber(number: string): boolean {
  // 하이픈 제거 및 숫자 배열 변환
  const cleanNumber = number.replace(/[^0-9]/g, "");

  if (cleanNumber.length !== 10) {
    return false;
  }

  // 모든 자리가 0인 경우는 제외
  if (/^0+$/.test(cleanNumber)) {
    return false;
  }

  const numberMap = cleanNumber.split("").map((d) => parseInt(d, 10));
  const keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let chk = 0;

  // 1~8번째 자리까지 가중치 곱하여 합산
  for (let i = 0; i < 8; i++) {
    chk += keyArr[i] * numberMap[i];
  }

  // 9번째 자리는 (값 * 5) 결과를 10으로 나눈 몫과 나머지를 더해줌 (핵심!)
  const ninthProduct = keyArr[8] * numberMap[8];
  chk += Math.floor(ninthProduct / 10) + (ninthProduct % 10);

  // 최종 check digit 계산
  const remainder = chk % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;

  // 10번째 자리와 일치하는지 비교
  return numberMap[9] === checkDigit;
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
function validateUrl(url: string): boolean {
  return urlRegex.test(url);
}

/**
 * 파일의 확장자와 크기를 검증합니다.
 * 기본 지원 확장자: jpg, jpeg, png, gif, webp, heic, heif, pdf, doc, docx, xls, xlsx, ppt, pptx, txt, zip, rar
 * @param file - 검증할 File 객체 또는 파일명 문자열
 * @param maxSizeInMB - 최대 파일 크기 (MB 단위, 기본값: 10MB)
 * @param allowedExtensions - 허용할 확장자 목록. 지정하면 기본 목록 대신 사용합니다. (대소문자·앞의 점 무시)
 * @returns 유효한 파일이면 true, 아니면 false
 * @example
 * validateFile(new File(['content'], 'document.pdf'), 5) // true (5MB 이하)
 * validateFile('image.jpg', 10) // true (확장자 검증만)
 * validateFile('photo.webp') // true
 * validateFile('model.glb', 10, ['glb', '.gltf']) // true (확장자 직접 지정)
 * validateFile('photo.jpg', 10, [...DEFAULT_FILE_EXTENSIONS, 'svg']) // 기본 목록에 추가
 */
function validateFile(
  file: File | string,
  maxSizeInMB: number = 10,
  allowedExtensions: readonly string[] = DEFAULT_FILE_EXTENSIONS
): boolean {
  const fileName = typeof file === "string" ? file : file.name;
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex < 0) {
    return false;
  }

  const extension = fileName.slice(dotIndex + 1).toLowerCase();
  const isAllowedExtension = allowedExtensions.some(
    (allowed) => allowed.replace(/^\./, "").toLowerCase() === extension
  );
  if (!extension || !isAllowedExtension) {
    return false;
  }

  if (typeof File !== "undefined" && file instanceof File) {
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      return false;
    }
  }

  return true;
}

export const validate = {
  email: validateEmail,
  phone: validatePhone,
  homePhone: validateHomePhone,
  birth6: validateBirth6,
  birth8: validateBirth8,
  password: validatePassword,
  juminAfter2020: validateJuminAfter2020,
  juminBefore2020: validateJuminBefore2020,
  corporateRegiNumber: validateCorporateRegiNumber,
  url: validateUrl,
  file: validateFile,
};
