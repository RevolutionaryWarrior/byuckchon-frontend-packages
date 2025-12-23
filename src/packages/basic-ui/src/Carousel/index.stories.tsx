import type { Meta, StoryObj } from "@storybook/react-vite";
import Carousel from "./index";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    children: {
      control: false,
      description: "캐러셀에 표시할 아이템 배열",
    },
    settings: {
      control: "object",
      description:
        "react-slick의 Settings 옵션 (arrows와 dots는 제외, 항상 커스텀 NavButton과 dots 사용)",
    },
    arrowsPosition: {
      control: "object",
      description:
        "화살표 위치를 커스터마이징할 수 있는 옵션 (prev, next 각각 top, bottom, left, right, transform 설정 가능)",
    },
    LeftArrow: {
      control: false,
      description: "커스텀 왼쪽 화살표 컴포넌트",
    },
    RightArrow: {
      control: false,
      description: "커스텀 오른쪽 화살표 컴포넌트",
    },
    dotsPosition: {
      control: "select",
      options: [
        "bottom-center",
        "bottom-left",
        "bottom-right",
        "top-center",
        "top-left",
        "top-right",
      ],
      description:
        "dots의 위치를 설정합니다. 설정하지 않으면 dots가 표시되지 않습니다.",
    },
    containerClassName: {
      control: "text",
      description: "캐러셀 컨테이너에 적용할 추가 CSS 클래스",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const sampleSlides = [
  <div
    key="1"
    style={{
      height: "300px",
      backgroundColor: "#4A90E2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    }}
  >
    슬라이드 1
  </div>,
  <div
    key="2"
    style={{
      height: "300px",
      backgroundColor: "#50C878",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    }}
  >
    슬라이드 2
  </div>,
  <div
    key="3"
    style={{
      height: "300px",
      backgroundColor: "#FF6B6B",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    }}
  >
    슬라이드 3
  </div>,
  <div
    key="4"
    style={{
      height: "300px",
      backgroundColor: "#FFD93D",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    }}
  >
    슬라이드 4
  </div>,
  <div
    key="5"
    style={{
      height: "300px",
      backgroundColor: "#9B59B6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    }}
  >
    슬라이드 5
  </div>,
];

export const Default: Story = {
  args: {
    children: sampleSlides,
  },
  parameters: {
    docs: {
      description: {
        story:
          "기본 캐러셀 예시입니다. dots와 커스텀 화살표 버튼이 포함되어 있습니다.",
      },
    },
  },
};

export const WithContent: Story = {
  render: () => {
    const contentSlides = [
      <div
        key="1"
        style={{
          padding: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          margin: "0 10px",
        }}
      >
        <h2 style={{ marginBottom: "16px", fontSize: "24px" }}>제목 1</h2>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          이것은 첫 번째 슬라이드의 콘텐츠입니다. 다양한 정보를 표시할 수
          있습니다.
        </p>
      </div>,
      <div
        key="2"
        style={{
          padding: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          margin: "0 10px",
        }}
      >
        <h2 style={{ marginBottom: "16px", fontSize: "24px" }}>제목 2</h2>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          이것은 두 번째 슬라이드의 콘텐츠입니다. 더 많은 정보를 포함할 수
          있습니다.
        </p>
      </div>,
      <div
        key="3"
        style={{
          padding: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          margin: "0 10px",
        }}
      >
        <h2 style={{ marginBottom: "16px", fontSize: "24px" }}>제목 3</h2>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          이것은 세 번째 슬라이드의 콘텐츠입니다. 다양한 형태의 콘텐츠를 표시할
          수 있습니다.
        </p>
      </div>,
    ];

    return <Carousel children={contentSlides} dotsPosition="bottom-center" />;
  },
  parameters: {
    docs: {
      description: {
        story: "실제 콘텐츠가 포함된 슬라이드 예시입니다.",
      },
    },
  },
};

export const ArrowPositionTop: Story = {
  args: {
    children: sampleSlides,
    arrowsPosition: {
      prev: { top: "0px", left: "0px" },
      next: { top: "0px", right: "0px" },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "화살표를 상단으로 이동한 예시입니다.",
      },
    },
  },
};

export const ArrowPositionBottom: Story = {
  args: {
    children: sampleSlides,
    arrowsPosition: {
      prev: { bottom: "0px", left: "0px" },
      next: { bottom: "0px", right: "0px" },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "화살표를 하단으로 이동한 예시입니다.",
      },
    },
  },
};

export const ArrowPositionCenter: Story = {
  args: {
    children: sampleSlides,
    arrowsPosition: {
      prev: { top: "50%", left: "0px", transform: "translateY(-50%)" },
      next: { top: "50%", right: "0px", transform: "translateY(-50%)" },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "화살표를 세로 중앙으로 이동한 예시입니다.",
      },
    },
  },
};

export const ArrowPositionCustom: Story = {
  args: {
    children: sampleSlides,
    arrowsPosition: {
      prev: { bottom: "0px", right: "50px" },
      next: { bottom: "0px", right: "0px" },
    },
    containerClassName: "pb-[50px]",
  },
  parameters: {
    docs: {
      description: {
        story:
          "화살표를 커스텀 위치로 이동한 예시입니다. prev, next 모두 하단에 배치됩니다.",
      },
    },
  },
};

export const WithContainerClassName: Story = {
  args: {
    children: sampleSlides,
    arrowsPosition: {
      prev: { left: "0px", top: "50%", transform: "translateY(-50%)" },
      next: { right: "0px", top: "50%", transform: "translateY(-50%)" },
    },
    dotsPosition: "bottom-center",
    containerClassName: "p-[50px]",
  },
  parameters: {
    docs: {
      description: {
        story:
          "containerClassName을 사용하여 컨테이너에 추가 스타일을 적용한 예시입니다.",
      },
    },
  },
};

export const DotsPositionBottomCenter: Story = {
  args: {
    children: sampleSlides,
    dotsPosition: "bottom-center",
  },
  parameters: {
    docs: {
      description: {
        story: "dots를 하단 중앙에 배치한 예시입니다.",
      },
    },
  },
};

export const DotsPositionBottomLeft: Story = {
  args: {
    children: sampleSlides,
    dotsPosition: "bottom-left",
  },
  parameters: {
    docs: {
      description: {
        story: "dots를 하단 왼쪽에 배치한 예시입니다.",
      },
    },
  },
};

export const DotsPositionBottomRight: Story = {
  args: {
    children: sampleSlides,
    dotsPosition: "bottom-right",
  },
  parameters: {
    docs: {
      description: {
        story: "dots를 하단 오른쪽에 배치한 예시입니다.",
      },
    },
  },
};

export const DotsPositionTopCenter: Story = {
  args: {
    children: sampleSlides,
    dotsPosition: "top-center",
  },
  parameters: {
    docs: {
      description: {
        story: "dots를 상단 중앙에 배치한 예시입니다.",
      },
    },
  },
};

export const DotsPositionTopLeft: Story = {
  args: {
    children: sampleSlides,
    dotsPosition: "top-left",
  },
  parameters: {
    docs: {
      description: {
        story: "dots를 상단 왼쪽에 배치한 예시입니다.",
      },
    },
  },
};

export const DotsPositionTopRight: Story = {
  args: {
    children: sampleSlides,
    dotsPosition: "top-right",
  },
  parameters: {
    docs: {
      description: {
        story: "dots를 상단 오른쪽에 배치한 예시입니다.",
      },
    },
  },
};

export const CustomArrows: Story = {
  render: () => {
    const customLeftArrow = (
      <div className="size-[50px] flex items-center justify-center bg-blue-500 rounded-full text-white font-bold text-xl">
        ←
      </div>
    );

    const customRightArrow = (
      <div className="size-[50px] flex items-center justify-center bg-blue-500 rounded-full text-white font-bold text-xl">
        →
      </div>
    );

    return (
      <Carousel
        children={sampleSlides}
        arrowsPosition={{
          prev: { left: "20px", top: "50%", transform: "translateY(-50%)" },
          next: { right: "20px", top: "50%", transform: "translateY(-50%)" },
        }}
        LeftArrow={customLeftArrow}
        RightArrow={customRightArrow}
        dotsPosition="bottom-center"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "커스텀 화살표를 사용한 예시입니다. LeftArrow와 RightArrow prop으로 원하는 화살표 컴포넌트를 전달할 수 있습니다.",
      },
    },
  },
};
