import type { Meta, StoryObj } from "@storybook/react-vite";
import Tooltip from "./index";
import type { Placement } from "./index";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    content: {
      control: "text",
      description: "툴팁 안에 표시될 텍스트 또는 React 노드입니다.",
    },
    placement: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
        "left-top",
        "right-top",
      ],
      description: "툴팁이 표시될 위치를 지정합니다.",
    },
    trigger: {
      control: "radio",
      options: ["hover", "click"],
      description: "툴팁이 열리는 트리거 방식을 설정합니다.",
    },
    variant: {
      control: false,
      description: "UIThemeProvider의 variant를 지정할 수 있습니다.",
    },
    className: {
      control: "text",
      description: "툴팁 컨테이너에 Tailwind 클래스를 추가합니다.",
    },
    children: {
      control: false,
      description: "툴팁이 표시될 기준 요소입니다.",
    },
  },
  args: {
    content:
      "상품 등록 이미지는 최소 1장 최대 5장 입니다. \n첫 번째 이미지가 상품의 대표 이미지입니다.",
    placement: "top-center",
    trigger: "hover",
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    className: "w-[234px] mb-2",
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-[#89B7FF] text-[#0058E4] w-[234px]">
        Hover Me
      </button>
    </Tooltip>
  ),
};

export const ClickTrigger: Story = {
  args: {
    trigger: "click",
    className: "w-[234px] mb-2",
  },
  render: (args) => (
    <Tooltip {...args}>
      <button className="px-4 py-2 bg-[#89B7FF] text-[#0058E4] w-[234px]">
        Click Me
      </button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  args: {
    variant: "default",
    className: "w-[180px] m-2",
  },
  render: (args) => (
    <div className="grid grid-cols-3 gap-10 text-center">
      {[
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
        "left-top",
        "right-top",
      ].map((placement) => (
        <Tooltip
          key={placement}
          {...args}
          placement={placement as Placement}
          content={`Placement: ${placement}`}
        >
          <button className="px-4 py-2 bg-[#89B7FF] text-[#0058E4] w-[234px]">
            {placement}
          </button>
        </Tooltip>
      ))}
    </div>
  ),
};
