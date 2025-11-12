import type { Meta, StoryObj } from "@storybook/react-vite";
import Breadcrumb from "./index";
import CheckIcon from "@icons/icon_byuckicon_check.svg?react";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    items: {
      control: false,
      description:
        "브레드크럼에 표시할 항목 배열입니다. 각 항목은 label, icon(선택), active(선택) 속성을 가집니다.",
    },
    mode: {
      control: "select",
      options: ["localNavMode", "progressMode"],
      description:
        "브레드크럼의 모드입니다. localNavMode는 화살표 아이콘, progressMode는 링크 아이콘을 사용합니다.",
    },
    isSeparator: {
      control: "boolean",
      description: "구분자(separator) 표시 여부입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// localNavMode: 화살표 아이콘 사용
export const LocalNavMode: Story = {
  args: {
    mode: "localNavMode",
    isSeparator: true,
    labelStyle: "text-[#222222] font-medium",
    items: [
      {
        label: "TEXT",
        icon: <span className="w-4 h-4 bg-[#222222] inline-block" />,
        active: false,
      },
      {
        label: "TEXT",
        icon: <span className="w-4 h-4 bg-[#222222] inline-block" />,
        active: false,
      },
      {
        label: "TEXT",
        icon: <span className="w-4 h-4 bg-[#222222] inline-block" />,
        active: false,
      },
    ],
  },
};

// progressMode: 링크 아이콘 사용 (사각형 아이콘 + 텍스트)
export const ProgressMode: Story = {
  args: {
    mode: "progressMode",
    isSeparator: true,
    items: [
      {
        label: <span className="text-[#0058E4] px-[8px]">TEXT</span>,
        icon: (
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-[#0058E4] rounded" />
          </div>
        ),
        active: true,
      },
      {
        label: <span className="text-[#0058E4] px-[8px]">TEXT</span>,
        icon: (
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-[#0058E4] rounded" />
          </div>
        ),
        active: true,
      },
      {
        label: "TEXT",
        icon: (
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-[#8F9098] rounded" />
          </div>
        ),
        active: false,
      },
    ],
  },
};

// 구분자 없음
export const WithoutSeparator: Story = {
  args: {
    mode: "localNavMode",
    isSeparator: false,
    items: [
      {
        label: "홈",
        icon: <span>😀</span>,
        active: false,
      },
      {
        label: "카테고리",
        icon: <span>😃</span>,
        active: false,
      },
      {
        label: "상세 페이지",
        icon: <span>😄</span>,
        active: true,
      },
    ],
  },
};

// progressMode: 사각형 안에 숫자가 들어있는 형태
export const ProgressModeWithNumbers: Story = {
  args: {
    mode: "progressMode",
    isSeparator: true,
    separatorColor: "#CCCCCC",
    items: [
      {
        label: (
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-[#0058E4] flex items-center justify-center">
              <CheckIcon className="text-white text-xs font-medium" />
            </div>
          </div>
        ),
        active: true,
      },
      {
        label: (
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-[#0058E4] flex items-center justify-center">
              <CheckIcon className="text-white text-xs font-medium" />
            </div>
          </div>
        ),
        active: true,
      },
      {
        label: (
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-[#ffffff] border-2 border-[#0058E4] flex items-center justify-center">
              <span className="text-[#0058E4] text-xs font-medium">3</span>
            </div>
          </div>
        ),
        active: true,
      },
      {
        label: (
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-[#8F9098] flex items-center justify-center">
              <span className="text-white text-xs font-medium">4</span>
            </div>
          </div>
        ),
        active: false,
      },
    ],
  },
};
