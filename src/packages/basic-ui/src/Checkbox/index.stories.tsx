import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Checkbox from "./index";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    defaultSize: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "체크박스 크기를 설정합니다.",
    },
    checked: {
      control: "boolean",
      description: "체크 여부를 제어합니다.",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태 여부를 제어합니다.",
    },
    children: {
      control: false,
      description: "커스텀 렌더링할 내용을 넣을 수 있습니다.",
    },
    className: {
      control: "text",
      description: "추가적인 Tailwind 클래스명을 전달합니다.",
    },
    onChange: {
      action: "changed",
      description: "체크 상태가 변경될 때 호출됩니다.",
    },
    variant: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    defaultSize: "md",
    checked: false,
  },
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(args.checked ?? false);

    useEffect(() => {
      setChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          {...args}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      </div>
    );
  },
};

export const Small: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(args.checked ?? false);

    useEffect(() => {
      setChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          {...args}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span className="text-sm">Small ({checked ? "on" : "off"})</span>
      </div>
    );
  },
};

export const Medium: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(args.checked ?? false);

    useEffect(() => {
      setChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          {...args}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          defaultSize="md"
        />
        <span className="text-base">Medium ({checked ? "on" : "off"})</span>
      </div>
    );
  },
};

export const Large: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(args.checked ?? false);

    useEffect(() => {
      setChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          {...args}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          defaultSize="lg"
        />
        <span className="text-lg">Large ({checked ? "on" : "off"})</span>
      </div>
    );
  },
};

export const WithCustomText: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(args.checked ?? false);

    useEffect(() => {
      setChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        defaultSize="md"
      >
        <span
          className={`font-semibold transition-colors duration-200 whitespace-nowrap ${
            checked ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {checked ? "선택됨" : "선택 안됨"}
        </span>
      </Checkbox>
    );
  },
};
