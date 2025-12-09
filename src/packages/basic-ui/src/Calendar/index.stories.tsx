import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Calendar from "./index";
import { UIThemeProvider } from "../UIThemeProvider";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "캘린더 전체 비활성화 여부",
    },
    disabledDates: {
      control: false,
      description: "비활성화할 날짜 배열",
    },
    value: {
      control: false,
      description: "선택된 날짜 값 (controlled component로 사용 시)",
    },
    onChange: {
      action: "date changed",
      description: "날짜 선택 시 호출되는 콜백 함수",
    },
    color: {
      control: "color",
      description: "텍스트 색상 (style prop, 최우선)",
    },
    fontSize: {
      control: "text",
      description: "폰트 크기 (style prop, 최우선)",
    },
    width: {
      control: "text",
      description: "캘린더 너비 (style prop, 최우선)",
    },
    height: {
      control: "text",
      description: "캘린더 높이 (style prop, 최우선)",
    },
    renderHeader: {
      control: false,
      description: "커스텀 헤더 렌더링 (기본 네비게이션 대체)",
    },
    renderTileContent: {
      control: false,
      description:
        "커스텀 타일 콘텐츠 렌더링 (각 날짜 타일 내부 디자인) - 제공 시 기본 날짜 표시 제거",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          {...args}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date | null)}
        />
        {selectedDate && (
          <p className="text-sm text-gray-600">
            선택된 날짜: {selectedDate.toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const disabledDates = [today, tomorrow];

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          {...args}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date | null)}
          disabledDates={disabledDates}
        />
        <div className="text-sm text-gray-600 space-y-1">
          <p>비활성화된 날짜:</p>
          <ul className="list-disc list-inside">
            <li>{today.toLocaleDateString("ko-KR")}</li>
            <li>{tomorrow.toLocaleDateString("ko-KR")}</li>
          </ul>
        </div>
      </div>
    );
  },
};

export const FullyDisabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomStyles: Story = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          {...args}
          color="#0058e4"
          fontSize="16px"
          width="400px"
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date | null)}
        />
      </div>
    );
  },
};

export const WithTheme: Story = {
  render: (args) => {
    return (
      <UIThemeProvider
        theme={{
          calendar: {
            color: "#333333",
            fontSize: "16px",
            width: "400px",
            activeColor: "#ff0000",
            hoverColor: "#ff6666",
            todayColor: "#00ff00",
            weekendColor: "#0000ff",
            disabledColor: "#cccccc",
          },
        }}
      >
        <Calendar {...args} />
      </UIThemeProvider>
    );
  },
};

export const CustomHeader: Story = {
  render: (args) => {
    return (
      <Calendar
        {...args}
        renderHeader={({ date, onPrev, onNext }) => (
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4">
            <button
              onClick={onPrev}
              className="px-4 py-2 bg-white rounded hover:bg-gray-200 transition-colors"
            >
              이전
            </button>
            <span className="font-bold text-lg">
              {date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
              })}
            </span>
            <button
              onClick={onNext}
              className="px-4 py-2 bg-white rounded hover:bg-gray-200 transition-colors"
            >
              다음
            </button>
          </div>
        )}
      />
    );
  },
};

export const CustomTileContent: Story = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          {...args}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date | null)}
          renderTileContent={({ date, view, isSelected }) => {
            if (view !== "month") return null;

            const day = date.getDate();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                className={`flex flex-col items-center justify-center h-full ${
                  isSelected
                    ? "bg-blue-500 text-white rounded-full"
                    : isWeekend
                    ? "text-blue-500"
                    : "text-gray-700"
                }`}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "40px",
                }}
              >
                <span className="text-sm font-semibold">{day}</span>
                {day % 7 === 0 && <span className="text-xs">이벤트</span>}
              </div>
            );
          }}
        />
        {selectedDate && (
          <p className="text-sm text-gray-600">
            선택된 날짜: {selectedDate.toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>
    );
  },
};

export const CustomHeaderAndTile: Story = {
  render: (args) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <Calendar
          {...args}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as Date | null)}
          renderHeader={({ date, onPrev, onNext }) => (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg mb-4 shadow-lg">
              <button
                onClick={onPrev}
                className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                ← 이전
              </button>
              <span className="font-bold text-xl">
                {date.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
              <button
                onClick={onNext}
                className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                다음 →
              </button>
            </div>
          )}
          renderTileContent={({ date, view, isSelected }) => {
            if (view !== "month") return null;

            const day = date.getDate();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isToday = (() => {
              const today = new Date();
              return (
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              );
            })();

            return (
              <div
                className={`flex flex-col items-center justify-center h-full transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white rounded-full shadow-lg scale-110"
                    : isToday
                    ? "bg-yellow-200 text-yellow-800 rounded-full font-bold"
                    : isWeekend
                    ? "text-blue-500 font-semibold"
                    : "text-gray-700"
                }`}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "40px",
                }}
              >
                <span className="text-sm">{day}</span>
              </div>
            );
          }}
        />
        {selectedDate && (
          <p className="text-sm text-gray-600">
            선택된 날짜: {selectedDate.toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>
    );
  },
};
