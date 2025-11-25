import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./index";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Input 라벨 텍스트",
    },
    placeholder: {
      control: "text",
      description: "Input placeholder 텍스트",
    },
    hasError: {
      control: "boolean",
      description: "에러 상태 여부",
    },
    errorMessage: {
      control: "text",
      description: "에러 메시지",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 여부",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel"],
      description: "Input 타입",
    },
    className: {
      control: "text",
      description: "외부 컨테이너 className",
    },
    inputClassName: {
      control: "text",
      description: "Input 요소 className",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "이름",
    placeholder: "이름을 입력하세요",
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "라벨 없는 Input",
  },
};

export const WithError: Story = {
  args: {
    label: "이메일",
    placeholder: "이메일을 입력하세요",
    hasError: true,
    errorMessage: "올바른 이메일 형식이 아닙니다.",
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화된 Input",
    placeholder: "입력할 수 없습니다",
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "검색",
    placeholder: "검색어를 입력하세요",
    rightIcon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
          stroke="#999"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const Number: Story = {
  args: {
    label: "나이",
    type: "number",
    placeholder: "나이를 입력하세요",
  },
};

export const Email: Story = {
  args: {
    label: "이메일",
    type: "email",
    placeholder: "example@email.com",
  },
};

