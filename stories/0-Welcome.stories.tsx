import React from "react";
import { linkTo } from "@storybook/addon-links";
import { Welcome } from "@storybook/react/demo";
import DForm from "../src/react-web";

export default {
  title: "Welcome",
  component: Welcome
};

export const ToStorybook = () => <DForm />;

ToStorybook.story = {
  name: "D Form"
};
