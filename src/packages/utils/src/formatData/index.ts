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

  const formatBizNumber = (value: number) => {
    return value;
  };

  const formatDate = (value: Date) => {
    return value;
  };

  const Masker = {
    maskName: (value: string) => value,
    maskPhoneNumber: (value: number) => value,
  };

  const commanizeData = (value: string | number) => {
    return value;
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
