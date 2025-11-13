import axios, { AxiosError } from "axios";

type Params = {
  error: AxiosError | Error | unknown;
  message?: string;
  callback?: () => void;
};

/**
 * 에러 처리 함수
 * - 에러 메세지를 콘솔에 출력하고, 사용자 정의 에러 처리 함수를 호출합니다.
 * - axios 에러의 경우 response.data.message || status || message 를 콘솔에 출력합니다.
 * - 일반 에러의 경우 error.message || message 를 콘솔에 출력합니다.
 * - unknown 타입의 경우 (type 지정 하지 않은 error) message 를 콘솔에 출력합니다.
 * 
 * @param {AxiosError | Error | unknown} error
 * @param {string} [message] - Optional message
 * @param {() => void} [callback] - Optional 사용자 정의 에러 처리 함수

 */
export const handleError = ({ error, message = "알 수 없는 에러가 발생했습니다.", callback }: Params): void => {
  if (axios.isAxiosError(error)) {
    console.error(error.response?.data?.message ?? error.status ?? message);

    return callback?.();
  }

  if (error instanceof Error) {
    console.error(error.message || message);

    return callback?.();
  }

  console.error(message);

  return callback?.();
};
