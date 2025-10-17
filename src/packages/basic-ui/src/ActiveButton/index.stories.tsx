import type { Meta, StoryObj } from "@storybook/react-vite";
import ActiveButton from "./index";

const meta: Meta<typeof ActiveButton> = {
  title: "Components/ActiveButton",
  component: ActiveButton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "disabled"],
      description: "버튼의 스타일 타입을 지정합니다.",
    },
    children: {
      control: "text",
      description: "버튼 내부 텍스트",
    },
    disabled: {
      control: "boolean",
      description: "버튼 비활성화 여부",
    },
    onClick: {
      action: "clicked",
      description: "버튼 클릭 이벤트",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActiveButton>;

export const Primary: Story = {
  args: {
    children: "확인",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "취소",
    variant: "secondary",
  },
};

export const Disabled: Story = {
  args: {
    children: "비활성화됨",
    variant: "disabled",
    disabled: true,
  },
};
