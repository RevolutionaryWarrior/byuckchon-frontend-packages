import type { Meta, StoryObj } from "@storybook/react-vite";
import Accordion from "./index";
import { UIThemeProvider } from "../UIThemeProvider";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    items: {
      control: false,
      description: "아코디언 아이템들의 배열입니다.",
    },
    allowMultiple: {
      control: "boolean",
      description: "여러 개의 아코디언을 동시에 열 수 있는지 여부입니다.",
    },
    variant: {
      control: "select",
      options: ["attached", "spaced"],
      description:
        "아코디언 아이템들의 배치 모드입니다. 'attached'는 붙어있고, 'spaced'는 떨어져 있습니다.",
    },
    spacing: {
      control: "text",
      description:
        "spaced 모드에서 아이템들 사이의 간격을 설정합니다. (예: space-y-2, space-y-4)",
    },
    className: {
      control: "text",
      description: "커스텀 클래스를 추가할 수 있습니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: [
      {
        title: "아코디언 제목",
        children: "아코디언 내용이 여기에 표시됩니다.",
      },
    ],
  },
};

export const Multiple: Story = {
  args: {
    items: [
      {
        title: "첫 번째 아코디언",
        children: "첫 번째 아코디언의 내용입니다.",
      },
      {
        title: "두 번째 아코디언",
        children: "두 번째 아코디언의 내용입니다.",
        defaultOpen: true,
      },
      {
        title: "세 번째 아코디언",
        children: "세 번째 아코디언의 내용입니다.",
      },
    ],
  },
};

export const WithLongContent: Story = {
  args: {
    items: [
      {
        title: "긴 내용이 있는 아코디언",
        children: `여기에 긴 내용이 들어갈 수 있습니다. 여러 줄의 텍스트가 들어가도 아코디언이 제대로 작동합니다. 
    
아코디언은 사용자가 클릭하면 열리고 닫히는 인터랙티브한 UI 컴포넌트입니다. 

이 컴포넌트는 간단하고 직관적인 사용자 경험을 제공합니다.`,
      },
    ],
  },
};

export const SingleOpen: Story = {
  args: {
    items: [
      {
        title: "첫 번째 아코디언",
        children: "첫 번째 아코디언의 내용입니다.",
      },
      {
        title: "두 번째 아코디언",
        children:
          "두 번째 아코디언의 내용입니다. 이 아코디언을 열면 첫 번째는 자동으로 닫힙니다.",
        defaultOpen: true,
      },
      {
        title: "세 번째 아코디언",
        children: "세 번째 아코디언의 내용입니다.",
      },
    ],
    allowMultiple: false,
  },
};

export const ModeDefault: Story = {
  render: () => (
    <UIThemeProvider
      theme={{
        accordion: {
          mode: "default",
        },
      }}
    >
      <Accordion
        items={[
          {
            title: "첫 번째 아코디언",
            children: "모드 1: 배경이 전부 흰색, isOpen이여도 흰색",
          },
          {
            title: "두 번째 아코디언",
            children: "이 아코디언을 열어도 배경색이 흰색으로 유지됩니다.",
            defaultOpen: true,
          },
          {
            title: "세 번째 아코디언",
            children: "모든 아이템이 항상 흰색 배경입니다.",
          },
        ]}
      />
    </UIThemeProvider>
  ),
};

export const ModeInverted: Story = {
  render: () => (
    <UIThemeProvider
      theme={{
        accordion: {
          mode: "inverted",
        },
      }}
    >
      <Accordion
        items={[
          {
            title: "첫 번째 아코디언",
            children: "모드 2: 배경이 전부 #F1F1F1, isOpen시 해당 요소만 흰색",
          },
          {
            title: "두 번째 아코디언",
            children: "이 아코디언을 열면 배경색이 흰색으로 변경됩니다.",
            defaultOpen: true,
          },
          {
            title: "세 번째 아코디언",
            children: "닫혀있을 때는 #F1F1F1 배경입니다.",
          },
        ]}
      />
    </UIThemeProvider>
  ),
};

export const ModeHighlight: Story = {
  render: () => (
    <UIThemeProvider
      theme={{
        accordion: {
          mode: "highlight",
        },
      }}
    >
      <Accordion
        items={[
          {
            title: "첫 번째 아코디언",
            children: "모드 3: 배경이 전부 흰색, isOpen 요소만 #F1F1F1",
          },
          {
            title: "두 번째 아코디언",
            children: "이 아코디언을 열면 배경색이 #F1F1F1로 변경됩니다.",
            defaultOpen: true,
          },
          {
            title: "세 번째 아코디언",
            children: "닫혀있을 때는 흰색 배경입니다.",
          },
        ]}
      />
    </UIThemeProvider>
  ),
};

export const Spaced: Story = {
  args: {
    items: [
      {
        title: "첫 번째 아코디언",
        children: "아이템들이 서로 떨어져 있는 모드입니다.",
      },
      {
        title: "두 번째 아코디언",
        children: "각 아이템이 독립적인 카드처럼 보입니다.",
        defaultOpen: true,
      },
      {
        title: "세 번째 아코디언",
        children: "rounded corner와 전체 border가 적용됩니다.",
      },
    ],
    variant: "spaced",
  },
};

export const SpacedWithCustomSpacing: Story = {
  args: {
    items: [
      {
        title: "첫 번째 아코디언",
        children: "커스텀 간격을 적용한 spaced 모드입니다.",
      },
      {
        title: "두 번째 아코디언",
        children: "spacing prop으로 간격을 조절할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "space-y-4로 더 넓은 간격을 적용했습니다.",
      },
    ],
    variant: "spaced",
    spacing: "space-y-4",
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        title: "첫 번째 아코디언",
        children: "아이콘이 있는 아코디언입니다.",
        icon: (
          <svg
            className="w-5 h-5 text-[#0058E4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: "두 번째 아코디언",
        children: "각 아이템마다 다른 아이콘을 사용할 수 있습니다.",
        defaultOpen: true,
        icon: (
          <svg
            className="w-5 h-5 text-[#0058E4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
      {
        title: "세 번째 아코디언",
        children: "아이콘이 없는 아이템도 함께 사용할 수 있습니다.",
      },
    ],
  },
};
