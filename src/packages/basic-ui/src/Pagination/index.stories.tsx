import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    totalCount: {
      control: "number",
      description: "전체 페이지 개수입니다.",
      defaultValue: 10,
    },
    currentPage: {
      control: false,
      description: "현재 페이지 번호입니다. 내부 상태로 제어됩니다.",
    },
    renderCount: {
      control: "number",
      description: "한 번에 표시할 페이지 버튼 수입니다.",
      defaultValue: 5,
    },
    showDeepButton: {
      control: "boolean",
      description: "처음/끝 이동 버튼을 표시할지 여부를 설정합니다.",
    },
    mode: {
      control: "radio",
      options: ["single", "multi"],
      description: "페이지 이동 모드를 설정합니다.",
    },
    className: {
      control: "text",
      description: "추가 Tailwind 클래스명을 지정합니다.",
    },
    Icon: {
      control: false,
      description: "커스텀 아이콘을 지정할 수 있습니다.",
    },
    onPageChange: {
      action: "page changed",
      description: "페이지 번호 변경 시 호출되는 콜백입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    totalCount: 10,
    renderCount: 5,
    mode: "single",
  },
  render: (args) => {
    const [page, setPage] = useState<number>(1);

    return (
      <div className="flex flex-col items-center gap-3">
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
        />
        <p className="text-sm text-gray-600">현재 페이지: {page}</p>
      </div>
    );
  },
};

export const SingleMode: Story = {
  args: {
    totalCount: 8,
    renderCount: 5,
    mode: "single",
  },
  render: (args) => {
    const [page, setPage] = useState(1);

    return (
      <div className="flex flex-col items-center gap-3">
        <Pagination
          {...args}
          currentPage={page}
          onPageChange={(p) => setPage(p)}
        />
        <p className="text-sm text-gray-600">현재 페이지: {page}</p>
      </div>
    );
  },
};
