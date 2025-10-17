import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ConfirmModal from "./index";

const meta: Meta<typeof ConfirmModal> = {
  title: "Components/Modals/ConfirmModal",
  component: ConfirmModal,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    title: {
      control: "text",
      description: "모달의 제목 텍스트입니다.",
    },
    description: {
      control: "text",
      description: "본문 설명 텍스트입니다.",
    },
    cancelText: {
      control: "text",
      description: "취소 버튼 텍스트입니다.",
    },
    confirmText: {
      control: "text",
      description: "확인 버튼 텍스트입니다.",
    },

    onCancel: {
      control: false,
      description: "취소 버튼 클릭 시 호출되는 핸들러입니다.",
    },
    onConfirm: {
      control: false,
      description: "확인 버튼 클릭 시 호출되는 핸들러입니다.",
    },
    onClose: {
      control: false,
      description: "닫기 아이콘 클릭 시 호출되는 핸들러입니다.",
    },
    Icon: {
      control: false,
      description: "커스텀 아이콘을 전달할 수 있습니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

export const Default: Story = {
  args: {
    title: "모달 제목을 작성해 주세요.",
    description: "부가 내용을 작성해 주세요.",
    cancelText: "버튼",
    confirmText: "버튼",
  },
  render: (args) => (
    <ConfirmModal
      {...args}
      onCancel={() => alert("버튼 1 선택")}
      onConfirm={() => alert("버튼 2 선택")}
      onClose={() => alert("모달 닫힘")}
    />
  ),
};

export const Closable: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    if (!open)
      return (
        <div className="p-8 text-center text-green-600 font-semibold">
          ✅ 모달이 닫혔습니다.
        </div>
      );

    return (
      <ConfirmModal
        title="닫기 테스트"
        description="닫기 버튼을 클릭하면 모달이 닫힙니다."
        cancelText="취소"
        confirmText="확인"
        onCancel={() => alert("취소 선택")}
        onConfirm={() => alert("확인 선택")}
        onClose={() => setOpen(false)}
      />
    );
  },
};
