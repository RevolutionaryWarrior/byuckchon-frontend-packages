import type { ToastContainerProps } from "react-toastify";
import ToastMessage, { ShowToast, type ToastMessageProps } from ".";
import type { Meta, StoryObj } from "@storybook/react-vite";

interface ToastStoryArgs extends ToastMessageProps, ToastContainerProps {}

const meta: Meta<ToastStoryArgs> = {
  title: "Components/ToastMessage",
  component: ToastMessage,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    message: {
      control: "text",
      description:
        "Toast에 표시할 메시지 (showToast 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: { summary: "string" },
      },
    },
    textAlign: {
      control: "select",
      options: ["left", "center", "right"],
      description:
        "텍스트 정렬 방향 (showToast 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: { summary: "'left' | 'center' | 'right'" },
        defaultValue: { summary: "left" },
      },
    },
    isCloseButton: {
      control: "boolean",
      description:
        "닫기 버튼 표시 여부 (showToast 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    iconPosition: {
      control: "select",
      options: ["start", "center"],
      description:
        "아이콘 세로 정렬 위치 (showToast 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: { summary: "'start' | 'center'" },
        defaultValue: { summary: "center" },
      },
    },
    variant: {
      control: "select",
      options: ["default", "error", "success", "warning"],
      description:
        "Toast 메시지의 스타일 변형 (showToast 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: { summary: "'default' | 'error' | 'success' | 'warning'" },
        defaultValue: { summary: "default" },
      },
    },
    autoClose: {
      control: "number",
      description:
        "자동으로 닫히는 시간 (ms). false면 자동으로 닫히지 않음 (ToastContainer 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: { summary: "number | false" },
        defaultValue: { summary: "false" },
      },
    },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description:
        "Toast 메시지가 표시될 위치 (ToastContainer 컴포넌트의 props로 전달됩니다.)",
      table: {
        type: {
          summary:
            "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
        },
        defaultValue: { summary: "top-center" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

export const Default: Story = {
  args: {
    message:
      "예시 텍스트를 위한 글을 쓰고 있습니다. 쉽지 않네요. 예시 텍스트를 위한 글을 쓰고 있습니다.",
    textAlign: "left",
    isCloseButton: true,
    iconPosition: "center",
    autoClose: false,
    position: "bottom-center",
  },
  render: (args) => {
    const { autoClose, position, ...toastOptions } = args;

    function handleClick() {
      ShowToast(toastOptions);
    }

    return (
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleClick}
        >
          Show Toast
        </button>
        <ToastMessage autoClose={autoClose} position={position} />
      </div>
    );
  },
};

export const CenterAlign: Story = {
  args: {
    message: "중앙 정렬된 토스트 메시지입니다.",
    textAlign: "center",
    isCloseButton: true,
    iconPosition: "center",
    autoClose: false,
  },
  render: (args) => {
    const { autoClose, ...toastOptions } = args;

    function handleClick() {
      ShowToast(toastOptions);
    }

    return (
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleClick}
        >
          Show Toast (Center)
        </button>
        <ToastMessage autoClose={autoClose} />
      </div>
    );
  },
};

export const WithoutCloseButton: Story = {
  args: {
    message:
      "닫기 버튼이 없는 토스트 메시지입니다. 3초 후 자동으로 사라집니다.",
    textAlign: "left",
    isCloseButton: false,
    iconPosition: "center",
    autoClose: 3000,
  },
  render: (args) => {
    const { autoClose, ...toastOptions } = args;

    function handleClick() {
      ShowToast(toastOptions);
    }

    return (
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleClick}
        >
          Show Toast (No Close Button)
        </button>
        <ToastMessage autoClose={autoClose} />
      </div>
    );
  },
};

export const WithIcon: Story = {
  args: {
    message: "아이콘이 포함된 토스트 메시지입니다.",
    textAlign: "left",
    isCloseButton: true,
    iconPosition: "start",
    autoClose: false,
    Icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  render: (args) => {
    const { autoClose, ...toastOptions } = args;

    function handleClick() {
      ShowToast(toastOptions);
    }

    return (
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleClick}
        >
          Show Toast (With Icon)
        </button>
        <ToastMessage autoClose={autoClose} />
      </div>
    );
  },
};
