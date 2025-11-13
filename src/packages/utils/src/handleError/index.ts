import axios, { AxiosError } from "axios";

type Params = {
  error: AxiosError | Error | unknown;
  message?: string;
  callback?: () => void;
};

type ErrorResponse = {
  type: "axios" | "client" | "unknown";
  message: string;
  status?: number;
}

/**
 * 에러 처리 함수
 * - 사용자 정의 에러 처리 함수를 호출하고 ErrorResponse 객체를 반환합니다.
 *
 * @param {AxiosError | Error | unknown} error
 * @param {string} [message] - Optional message
 * @param {() => void} [callback] - Optional 사용자 정의 에러 처리 함수
 * 
 * @returns {ErrorResponse} ErrorResponse 객체
 */

export const handleError = ({ error, message = "알 수 없는 에러가 발생했습니다.", callback }: Params): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    callback?.();

    return {
      type: "axios",
      message: error.response?.data?.message ?? message,
      status: error.status || undefined,
    }
  }

  if (error instanceof Error) {
    callback?.();

    return {
      type: "client",
      message: error.message || message,
    }
  }

  callback?.();

  return {
    type: "unknown",
    message: message,
  }
};
