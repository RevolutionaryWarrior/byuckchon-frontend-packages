import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import BottomSheet from ".";

const meta: Meta<typeof BottomSheet> = {
  title: "Components/BottomSheet",
  component: BottomSheet,
};

export default meta;

type Story = StoryObj<typeof BottomSheet>;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* 공통 Wrapper */
const Template = (args: any) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        BottomSheet 열기
      </button>

      {open && (
        <BottomSheet
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          onExit={() => setOpen(false)}
        >
          {args.children}
        </BottomSheet>
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <Template>
      <div className="p-4 text-center">기본 BottomSheet 입니다.</div>
    </Template>
  ),
};

export const SnapPoints: Story = {
  render: () => (
    <Template snapPoints={[0.3, 0.6, 0.9]} defaultSnapPoint={0.3}>
      <div className="space-y-4 p-4">
        <h2 className="text-lg font-semibold text-center">
          Snap Points 테스트
        </h2>
        <p className="text-gray-700">
          30% → 60% → 90% 로 스냅 이동이 가능합니다.
        </p>
      </div>
    </Template>
  ),
};
