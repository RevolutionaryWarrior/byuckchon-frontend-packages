/**
 * axios 의 AxiosError 와 같은 모양의 최소 타입.
 * utils 가 axios 를 의존성으로 들고 있으면 fetch 만 쓰는 프로젝트에도 axios 가 설치되므로,
 * axios 를 import 하지 않고 `isAxiosError` 플래그로 판별한다. (axios.isAxiosError 와 동일한 기준)
 */
type AxiosLikeError = {
  isAxiosError: true;
  message: string;
  response?: {
    status?: number;
    data?: { message?: string } | unknown;
  };
};

type Params = {
  error: AxiosLikeError | Error | unknown;
  message?: string;
  callback?: () => void;
};

type ErrorResponse = {
  type: "axios" | "client" | "unknown";
  message: string;
  status?: number;
};

const isAxiosLikeError = (error: unknown): error is AxiosLikeError =>
  typeof error === "object" && error !== null && (error as { isAxiosError?: unknown }).isAxiosError === true;

const readResponseMessage = (data: unknown): string | undefined => {
  if (typeof data !== "object" || data === null) return undefined;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
};

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
  if (isAxiosLikeError(error)) {
    callback?.();

    return {
      type: "axios",
      message: readResponseMessage(error.response?.data) ?? message,
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    callback?.();

    return {
      type: "client",
      message: error.message || message,
    };
  }

  callback?.();

  return {
    type: "unknown",
    message: message,
  };
};
