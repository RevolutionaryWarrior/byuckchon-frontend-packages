import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocalNavBreadcrumb } from "./index";

const meta: Meta<typeof LocalNavBreadcrumb> = {
  title: "Components/Breadcrumb/LocalNavBreadcrumb",
  component: LocalNavBreadcrumb,
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
    isSeparator: {
      control: "boolean",
      description: "구분자(separator) 표시 여부입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocalNavBreadcrumb>;

export const Default: Story = {
  args: {
    isSeparator: true,
    labelStyle: "text-[#222222] font-medium",
    items: [
      {
        label: "TEXT",
        icon: <span className="w-4 h-4 bg-[#222222] inline-block" />,
      },
      {
        label: "TEXT",
        icon: <span className="w-4 h-4 bg-[#222222] inline-block" />,
      },
      {
        label: "TEXT",
        icon: <span className="w-4 h-4 bg-[#222222] inline-block" />,
      },
    ],
  },
};

export const WithoutSeparator: Story = {
  args: {
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
