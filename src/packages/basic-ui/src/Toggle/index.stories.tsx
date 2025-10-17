import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Toggle from "./index";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      controls: {
        include: ["checked", , "className", "onChange"],
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "토글의 on/off 상태를 제어합니다.",
    },
    className: {
      control: "text",
      description:
        "Tailwind 클래스명을 추가해 크기나 색상을 커스터마이징할 수 있습니다.",
    },
    onChange: {
      action: "changed",
      description: "토글 상태가 변경될 때 호출됩니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

/* -------------------------- 기본 토글 -------------------------- */
export const Default: Story = {
  args: {
    checked: false,
    className: "w-14 h-8",
  },
  render: (args) => {
    const [checked, setChecked] = useState<boolean>(args.checked ?? false);

    useEffect(() => {
      setChecked(args.checked ?? false);
    }, [args.checked]);

    return (
      <div className="flex flex-col items-center gap-4">
        <Toggle
          {...args}
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked);
          }}
        />
      </div>
    );
  },
};
