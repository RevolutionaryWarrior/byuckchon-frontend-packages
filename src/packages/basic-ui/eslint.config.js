import { baseConfig } from "../../../eslint.config.js";
import storybook from "eslint-plugin-storybook";

export default [...baseConfig, storybook.configs["flat/recommended"]];
