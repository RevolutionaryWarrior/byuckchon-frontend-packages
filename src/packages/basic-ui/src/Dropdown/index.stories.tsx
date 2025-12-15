import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Dropdown from "./index";
import type { DropdownOptionType } from "./index";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    options: {
      control: false,
      description: "드롭다운에 표시할 옵션 배열입니다.",
    },
    selectedOption: {
      control: false,
      description: "현재 선택된 옵션을 나타냅니다.",
    },
    placeholder: {
      control: "text",
      description: "선택 전 표시할 플레이스홀더 텍스트입니다.",
    },
    disabled: {
      control: "boolean",
      description: "드롭다운 비활성화 여부를 설정합니다.",
    },
    triggerClassName: {
      control: "text",
      description: "트리거 버튼에 추가할 Tailwind 클래스명입니다.",
    },
    optionWrapperClassName: {
      control: "text",
      description: "옵션 리스트 래퍼에 적용할 클래스입니다.",
    },
    optionClassName: {
      control: "text",
      description: "각 옵션에 적용할 클래스입니다.",
    },
    renderTrigger: {
      control: false,
      description: "트리거 커스텀 렌더링 함수입니다.",
    },
    renderOption: {
      control: false,
      description: "옵션 커스텀 렌더링 함수입니다.",
    },
    onChange: {
      control: false,
      description: "옵션이 선택될 때 호출되는 콜백입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    placeholder: "옵션을 선택하세요",
  },
  render: (args) => {
    const [selected, setSelected] = useState<DropdownOptionType | undefined>(
      undefined
    );

    const options: DropdownOptionType[] = [
      { label: "사과", value: "apple" },
      { label: "바나나", value: "banana" },
      { label: "포도", value: "grape" },
      { label: "사과", value: "apple" },
      { label: "바나나", value: "banana" },
      { label: "포도", value: "grape" },
    ];

    return (
      <div className="w-[240px]">
        <Dropdown
          {...args}
          options={options}
          selectedOption={selected}
          onChange={(opt) => setSelected(opt)}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화된 드롭다운",
    disabled: true,
  },
  render: (args) => {
    const options: DropdownOptionType[] = [
      { label: "선택 불가", value: "none" },
    ];
    return (
      <div className="w-[240px]">
        <Dropdown {...args} options={options} onChange={() => {}} />
      </div>
    );
  },
};
