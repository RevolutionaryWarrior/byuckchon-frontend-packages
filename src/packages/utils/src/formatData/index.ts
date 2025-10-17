export const FormatData = () => {
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

  const formatDate = (value: Date): string => {
    if (!(value instanceof Date) || isNaN(value.getTime())) return "";

    const h = value.getHours();
    const m = value.getMinutes();

    const meridiem = h < 12 ? "오전" : "오후";
    const hour12 = h % 12 === 0 ? 12 : h % 12;

    return `${meridiem} ${hour12}시 ${m}분`;
  };

  const Masker = {
    maskName: (raw: string): string => {
      const value = (raw ?? "").trim();
      const len = [...value].length;

      if (len <= 0) return "";
      if (len === 1) return "*";
      if (len === 2) {
        const [f] = [...value];
        return `${f}*`;
      }
      const chars = [...value];
      const first = chars[0];
      const last = chars[len - 1];
      const midStars = "*".repeat(len - 2);
      return `${first}${midStars}${last}`;
    },

    maskPhoneNumber: (input: string): string => {
      const s = input ?? "";

      if (s.includes("-")) {
        const parts = s.split("-");
        if (parts.length === 3) {
          const [a, b, c] = parts;
          return `${a}-${"*".repeat(b.replace(/\D/g, "").length || 4)}-${c}`;
        }
        if (parts.length === 2) {
          const [a, b] = parts;
          const digitsB = b.replace(/\D/g, "");
          const keepTail = digitsB.slice(-4);
          const starLen = Math.max(1, digitsB.length - keepTail.length);
          return `${a}-${"*".repeat(starLen)}${keepTail}`;
        }
        return s;
      }

      const d = s.replace(/\D/g, "");
      if (d.length < 8) return s;

      const head = d.slice(0, 3);
      const tail = d.slice(-4);
      const midLen = Math.max(1, d.length - (head.length + tail.length));
      return `${head}${"*".repeat(midLen)}${tail}`;
    },
  };

  const commanizeData = (value: string | number): string => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";

    // 기존 콤마 제거 후 부호/정수/소수 분리
    const cleaned = raw.replace(/,/g, "");
    const sign = cleaned.startsWith("-") ? "-" : "";
    const body = cleaned.replace(/^-/, "");
    const [intPart, fracPart] = body.split(".");

    // 정수부에만 콤마 삽입
    const intWithComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return sign + intWithComma + (fracPart !== undefined ? `.${fracPart}` : "");
  };

  const decommanizeData = (value: string) => {
    return value;
  };

  return {
    formatPhoneNumber,
    formatBizNumber,
    formatDate,
    Masker,
    commanizeData,
    decommanizeData,
  };
};
