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
// 2020년생 이후 주민등록번호도 통과 되도록
const juminRegex =
  /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-8][0-9]{6}$/;
const urlRegex =
  /^https?:\/\/(?:[-\w.])+(?:\.[a-zA-Z]{2,})+(?::\d+)?(?:\/[^\s]*)?$/i;
const defaultFileExtensionRegex =
  /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i;

type Props = {
  type:
    | "email"
    | "phone"
    | "homePhone"
    | "birth6"
    | "birth8"
    | "password"
    | "jumin"
    | "corporateRegiNumber"
    | "url"
    | "file";
  value: string | File;
  maxSizeInMB?: number;
};

function checkCorporateRegiNumber(number: string): boolean {
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

function validateFile(file: File | string, maxSizeInMB: number = 10): boolean {
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

function validateWithRegex(value: string, regex: RegExp): boolean {
  return regex.test(value);
}

export const validate = ({ type, value, maxSizeInMB }: Props) => {
  const regexMap = {
    email: emailRegex,
    phone: phoneRegex,
    homePhone: homePhoneRegex,
    birth6: birthRegex6,
    birth8: birthRegex8,
    password: passwordRegex,
    jumin: juminRegex,
    url: urlRegex,
  };

  if (type === "corporateRegiNumber") {
    return checkCorporateRegiNumber(value as string);
  }

  if (type === "file") {
    return validateFile(value as File | string, maxSizeInMB);
  }

  return validateWithRegex(value as string, regexMap[type]);
};
