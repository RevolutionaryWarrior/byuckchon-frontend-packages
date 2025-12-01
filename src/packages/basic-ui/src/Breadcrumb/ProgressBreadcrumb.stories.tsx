import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBreadcrumb } from "./index";
import CheckIcon from "@icons/icon_byuckicon_check.svg?react";

const meta: Meta<typeof ProgressBreadcrumb> = {
  title: "Components/Breadcrumb/ProgressBreadcrumb",
  component: ProgressBreadcrumb,
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
type Story = StoryObj<typeof ProgressBreadcrumb>;

export const Default: Story = {
  args: {
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

export const WithNumbers: Story = {
  args: {
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
