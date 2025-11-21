import { type InputHTMLAttributes, type ReactNode } from "react";

type Props = {
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  rightIcon?: ReactNode;
  renderLabel?: () => ReactNode;
  renderRightIcon?: () => ReactNode;
  renderErrorMessage?: () => ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  label,
  hasError,
  errorMessage,
  className = "",
  inputClassName,
  rightIcon,
  renderLabel,
  renderRightIcon,
  renderErrorMessage,
  ...props
}: Props) => {
  const borderClass = hasError
    ? "border border-[#F00]"
    : "border border-[#CCC]";

  const backgroundClass = props.disabled ? "bg-[#F5F5F5]" : "bg-white";

  return (
    <div className={className}>
      {renderLabel
        ? renderLabel?.()
        : label && (
            <label className="mb-2 block text-button-active">{label}</label>
          )}
      <div className="relative">
        <input
          className={`${borderClass} ${backgroundClass} ${inputClassName} ${
            rightIcon ? "pr-12" : ""
          } text-input h-[52px] w-full p-4 outline-none`}
          {...props}
        />
        {renderRightIcon
          ? renderRightIcon?.()
          : rightIcon && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                {rightIcon}
              </div>
            )}
      </div>
      {renderErrorMessage
        ? renderErrorMessage?.()
        : hasError &&
          errorMessage && (
            <p className="ml-2 text-sm text-[#F00]">{errorMessage}</p>
          )}
    </div>
  );
};

export default Input;
