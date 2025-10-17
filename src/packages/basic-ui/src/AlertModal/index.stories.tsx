import type { Meta, StoryObj } from "@storybook/react-vite";
import AlertModal from "./index";
import { useState } from "react";

const meta: Meta<typeof AlertModal> = {
  title: "Components/Modals/AlertModal",
  component: AlertModal,
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
    confirmText: {
      control: "text",
      description: "확인 버튼에 표시할 텍스트입니다.",
    },
    Icon: {
      control: false,
      description: "모달 상단 우측의 닫기 아이콘 또는 커스텀 아이콘",
    },
    isScrollable: {
      control: "boolean",
      description: "본문이 길 경우 스크롤 가능 여부를 제어합니다.",
    },
    customScrollClassName: {
      control: "text",
      description: "스크롤 영역에 커스텀 클래스를 추가할 수 있습니다.",
    },
    onClickConfirm: {
      action: "confirm clicked",
      description: "확인 버튼 클릭 이벤트",
    },
    onClose: {
      action: "close clicked",
      description: "닫기 아이콘 클릭 이벤트",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertModal>;

export const Default: Story = {
  args: {
    title: "모달 제목을 작성해 주세요.",
    description: "부가 내용을 작성해 주세요.",
    confirmText: "버튼",
  },
};

export const WithLongContent: Story = {
  args: {
    title: "모달 제목을 작성해 주세요.",
    description: `많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. 이를 위해서 작성되고 있는 글입니다. 많은 내용들이 들어갈 공간입니다. `,
    confirmText: "버튼",
    isScrollable: true,
  },
};

export const Closable: Story = {
  render: () => {
    const [open, setOpen] = useState<boolean>(true);

    if (!open) return <p>✅ 모달이 닫혔습니다.</p>;

    return (
      <AlertModal
        title="닫기 테스트"
        description="이 모달은 닫기 버튼을 누르면 사라집니다."
        confirmText="확인"
        onClickConfirm={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    );
  },
};
