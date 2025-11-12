import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import BottomSheet from ".";

const meta: Meta<typeof BottomSheet> = {
  title: "Components/BottomSheet",
  component: BottomSheet,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    title: {
      control: "text",
      description: "바텀시트 상단의 제목 텍스트",
    },
    titleAlign: {
      control: { type: "radio" },
      options: ["center", "left"],
      description: "타이틀 정렬 방향 (기본값: center)",
    },
    radiusClassName: {
      control: "text",
      description: "상단 radius 커스터마이징 클래스 (예: rounded-t-[32px])",
    },
    cancelText: {
      control: "text",
      description: "취소 버튼 텍스트",
    },
    confirmText: {
      control: "text",
      description: "확인 버튼 텍스트",
    },
    extraText: {
      control: "text",
      description: "하단 부가 텍스트 (선택)",
    },
    showClose: {
      control: "boolean",
      description: "우측 상단 닫기 버튼 표시 여부",
    },
    onConfirm: { action: "onConfirm", description: "확인 버튼 클릭 이벤트" },
    onCancel: { action: "onCancel", description: "취소 버튼 클릭 이벤트" },
    onClose: {
      action: "onClose",
      description: "닫기 버튼 또는 바깥 클릭 시 이벤트",
    },
    onBack: {
      action: "onBack",
      description: "왼쪽 뒤로가기 버튼 클릭 이벤트",
    },
    onExtraClick: {
      action: "onExtraClick",
      description: "부가 텍스트 클릭 이벤트",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = {
  args: {
    title: "타이틀",
    cancelText: "취소",
    confirmText: "확인",
    extraText: "부가 내용 / 링크 작성란",
    showClose: true,
    titleAlign: "center",
    radiusClassName: "rounded-t-[24px]",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <div className="relative flex flex-col items-center justify-center p-10">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          바텀시트 열기
        </button>

        <BottomSheet
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => alert("확인 클릭")}
          onCancel={() => setIsOpen(false)}
          radiusClassName={args.radiusClassName}
        >
          <p className="mt-3 text-gray-600 text-center">
            내용을 적는 공간입니다.내용을 적는 공간입니다.내용을 적는
            공간입니다.
          </p>
        </BottomSheet>
      </div>
    );
  },
};
