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
    if (/^0\d+/.test(d)) {
      if (d.length === 10)
        return d.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
      if (d.length === 11)
        return d.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
    }

    return value;
  };

  const formatTelNumber = (value: number) => {
    console.log(value);
    return value;
  };

  const formatBizNumber = (value: number) => {
    console.log(value);
    return value;
  };

  const formatDate = (value: Date) => {
    console.log(value);
    return value;
  };

  const Masker = {
    maskName: (value: string) => value,
    maskPhoneNumber: (value: number) => value,
  };

  const commanizeData = (value: string | number) => {
    console.log(value);
    return value;
  };

  const decommanizeData = (value: string) => {
    console.log(value);
    return value;
  };

  return {
    formatPhoneNumber,
    formatTelNumber,
    formatBizNumber,
    formatDate,
    Masker,
    commanizeData,
    decommanizeData,
  };
};
