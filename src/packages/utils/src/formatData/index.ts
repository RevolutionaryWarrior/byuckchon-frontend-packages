/**
 * 유틸 팩토리: 전화번호/사업자번호/날짜 포매팅, 마스킹, 숫자 콤마 처리 등 제공
 *
 * @returns 객체 형태의 포매터/마스커 유틸들
 * @example
 * const { formatPhoneNumber, Masker, commanizeData } = FormatData();
 * formatPhoneNumber("01012345678");      // "010-1234-5678"
 * Masker.maskName("홍길동");               // "홍*동"
 * commanizeData(1234567.89);             // "1,234,567.89"
 */

export const FormatData = () => {
  /**
   * 한국 전화번호를 규칙에 맞게 하이픈으로 포맷합니다.
   *
   * 규칙:
   * - 대표번호(15xx/16xx/18xx-xxxx): 총 8자리 → 4-4
   * - 02 지역번호: 9자리 → 02-XXX-XXXX, 10자리 → 02-XXXX-XXXX
   * - 그 외(0xx 시작): 10자리 → 0xx-xxx-xxxx, 11자리 → 0xx-xxxx-xxxx
   *
   * @param {string} value 숫자/문자 혼합 입력도 가능 (숫자만 추출)
   * @returns {string} 포맷된 전화번호 문자열 (규칙 미적용 시 원본 반환)
   * @example
   *
   * formatPhoneNumber("15881234");     // "1588-1234"
   * formatPhoneNumber("021234567");    // "02-123-4567"
   * formatPhoneNumber("0212345678");   // "02-1234-5678"
   * formatPhoneNumber("01012345678");  // "010-1234-5678"
   */

  const formatPhoneNumber = (value: string): string => {
    const d = (value ?? "").replace(/\D/g, "");

    // - 대표번호(15xx/16xx/18xx-xxxx): 4-4
    if (/^1[568]\d{7}$/.test(d)) {
      return d.replace(/^(\d{4})(\d{4})$/, "$1-$2");
    }

    // - 02 지역: 9자리 → 02-XXX-XXXX, 10자리 → 02-XXXX-XXXX
    if (d.startsWith("02")) {
      if (d.length === 9)
        return d.replace(/^(\d{2})(\d{3})(\d{4})$/, "$1-$2-$3");
      if (d.length === 10)
        return d.replace(/^(\d{2})(\d{4})(\d{4})$/, "$1-$2-$3");
    }

    // - 그 외(0xx): 10자리 → 0xx-xxx-xxxx, 11자리 → 0xx-xxxx-xxxx
    // - 여기에 집 전화번호 자동 하이픈 추가도 포함
    if (/^0\d+/.test(d)) {
      if (d.length === 10)
        return d.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
      if (d.length === 11)
        return d.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
    }

    return value;
  };

  /**
   * 사업자등록번호/법인등록번호 포매팅
   *
   * - 사업자등록번호: 10자리 → 3-2-5
   * - 법인등록번호:   13자리 → 6-7
   *
   * @param {string} value 숫자 이외 문자는 제거하여 판단
   * @returns {string} 포맷된 문자열 (길이 불일치 시 원본 문자열 반환)
   * @example
   * formatBizNumber("1234567890");    // "123-45-67890"
   * formatBizNumber("123456-1234567"); // "123456-1234567"
   */

  const formatBizNumber = (value: string): string => {
    const d = (value ?? "").replace(/\D/g, "");

    // 사업자등록번호 (10자리)
    if (d.length === 10) {
      return d.replace(/^(\d{3})(\d{2})(\d{5})$/, "$1-$2-$3");
    }

    // 법인등록번호 (13자리)
    if (d.length === 13) {
      return d.replace(/^(\d{6})(\d{7})$/, "$1-$2");
    }

    return String(value ?? "");
  };

  /**
   * Date 객체를 "오전/오후 h시 m분" 형태로 변환합니다.
   *
   * @param {Date} value 유효한 Date 객체
   * @returns {string} 한국어 시각 표현 (유효하지 않으면 빈 문자열)
   * @example
   * formatDate(new Date("2025-10-25T09:05:00")); // "오전 9시 5분"
   */

  const formatDate = (value: Date): string => {
    if (!(value instanceof Date) || isNaN(value.getTime())) return "";

    const h = value.getHours();
    const m = value.getMinutes();

    const meridiem = h < 12 ? "오전" : "오후";
    const hour12 = h % 12 === 0 ? 12 : h % 12;

    return `${meridiem} ${hour12}시 ${m}분`;
  };

  /**
   * 마스킹 관련 유틸
   */

  const Masker = {
    /**
     * 이름/문자열 마스킹
     * - 1글자: "*"
     * - 2글자: 첫 글자 + "*"
     * - 3글자 이상: 첫 글자 + (중간 전부 "*") + 마지막 글자
     *
     * @param {string} raw 원본 문자열
     * @returns {string} 마스킹된 문자열 (공백/빈문자열 입력 시 빈 문자열)
     * @example
     * Masker.maskName("홍");      // "*"
     * Masker.maskName("홍길");    // "홍*"
     * Masker.maskName("홍길동");  // "홍*동"
     */

    maskName: (raw: string): string => {
      const value = (raw ?? "").trim();
      const len = [...value].length;

      if (len <= 0) return "";
      if (len === 1) return "*";
      if (len === 2) {
        const [f] = [...value];
        return `${f}*`;
      }

      // 3글자 이상부터는 사이에 *로 채우기
      const chars = [...value];
      const first = chars[0];
      const last = chars[len - 1];

      const midStars = "*".repeat(len - 2);
      return `${first}${midStars}${last}`;
    },

    /**
     * 전화번호 마스킹
     * - 하이픈 포함 입력을 우선 처리(중간 블록을 *로), 하이픈 미포함 시 3-*-4 규칙으로 생성
     * - 최소 8자리 미만은 원본 반환
     *
     * @param {string} input 전화번호(하이픈 포함/미포함 모두 가능)
     * @returns {string} 마스킹된 전화번호
     * @example
     * Masker.maskPhoneNumber("010-1234-5678"); // "010-****-5678"
     * Masker.maskPhoneNumber("0212345678");    // "021****678" (하이픈 미포함 입력)
     */

    maskPhoneNumber: (input: string): string => {
      if (input.includes("-")) {
        const parts = input.split("-");
        if (parts.length === 3) {
          const [first, second, third] = parts;
          return `${first}-${"*".repeat(
            second.replace(/\D/g, "").length || 4
          )}-${third}`;
        }
        if (parts.length === 2) {
          const [start, last] = parts;
          const digitsB = last.replace(/\D/g, "");
          const keepTail = digitsB.slice(-4);
          const starLen = Math.max(1, digitsB.length - keepTail.length);
          return `${start}-${"*".repeat(starLen)}${keepTail}`;
        }
        return input;
      }

      // -가 없는 경우
      const d = input.replace(/\D/g, "");
      if (d.length < 8) return input;

      const head = d.slice(0, 3);
      const tail = d.slice(-4);
      const midLen = Math.max(1, d.length - (head.length + tail.length));
      return `${head}${"*".repeat(midLen)}${tail}`;
    },
  };

  /**
   * 숫자 문자열에 천 단위 콤마를 추가합니다.
   * - 음수/소수점 지원
   * - 기존 콤마가 있어도 안전하게 재포매팅
   *
   * @param {string|number} value 콤마를 넣을 값
   * @returns {string} 콤마가 적용된 문자열
   * @example
   * commanizeData("1234567");     // "1,234,567"
   * commanizeData("-1234.50");    // "-1,234.50"
   * commanizeData(0);             // "0"
   */

  const commanizeData = (value: string | number): string => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";

    const cleaned = raw.replace(/,/g, "");
    const sign = cleaned.startsWith("-") ? "-" : "";
    const body = cleaned.replace(/^-/, "");
    const [intPart, fracPart] = body.split(".");

    const intWithComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return sign + intWithComma + (fracPart !== undefined ? `.${fracPart}` : "");
  };

  /**
   * 숫자 문자열에서 모든 콤마(,)를 제거합니다.
   *
   * @param {string} value 콤마 제거 대상
   * @returns {string} 콤마가 제거된 문자열
   * @example
   * decommanizeData("1,234,567.89"); // "1234567.89"
   */

  const decommanizeData = (value: string) => value.replace(/,/g, "");

  return {
    formatPhoneNumber,
    formatBizNumber,
    formatDate,
    Masker,
    commanizeData,
    decommanizeData,
  };
};
