/**
 * DOM 요소에 연결하는 ref 객체 타입.
 *
 * `useRef<T | null>(null)` 의 반환 타입을 그대로 노출하면 d.ts 에 React 19 방식의
 * `RefObject<T | null>` 로 찍히는데, @types/react 18 에서는 이 타입이 JSX `ref`(LegacyRef<T>)에
 * 할당되지 않는다 (TS2322). React 18 / 19 양쪽의 `ref` prop 에 모두 할당되도록
 * RefObject 를 참조하지 않는 구조적 타입으로 선언한다.
 */
export type ElementRefObject<T> = { current: T | null };
