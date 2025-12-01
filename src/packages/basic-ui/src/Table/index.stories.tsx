/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Table from "./index";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    checkOptions: {
      control: false,
    },
    header: {
      control: false,
    },
    data: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleHeader = [
  { key: "name", label: "이름", width: "150px" },
  { key: "age", label: "나이", width: "80px" },
];

const withCheckboxSampleHeader = [
  { key: "check", label: "", width: "50px" },
  { key: "name", label: "이름", width: "150px" },
  { key: "age", label: "나이", width: "80px" },
];

const sampleData = [
  { id: 1, name: "홍길동", age: 30 },
  { id: 2, name: "김철수", age: 25 },
  { id: 3, name: "이영희", age: 28 },
];

export const Default: Story = {
  args: {
    header: sampleHeader,
    data: sampleData,
  },
};

export const WithCheckbox: Story = {
  render: (args) => {
    const [checkedData, setCheckedData] = useState<any[]>([]);

    const onChange = (newCheckedData: any[]) => {
      setCheckedData(newCheckedData);
    };

    return (
      <Table
        {...args}
        checkOptions={{
          allChecked: true,
          checkedData,
          onChange,
        }}
      />
    );
  },
  args: {
    header: withCheckboxSampleHeader,
    data: sampleData,
  },
};
