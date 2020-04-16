import React from "react";
import { action } from "@storybook/addon-actions";
import { Button } from "@storybook/react/demo";

import DForm from "../src/react-web";

export default {
  title: "Basic",
  // component: Button,
};

export const Basic = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: "name",
            placeholder: "Name",
            type: "Input",
            props: {
              onKeyPress: (e) => {
                if (e.which == 32) {
                  e.preventDefault();
                  console.log("Space Detected");
                  return false;
                }
              },
            },
          },
        ],
      },
    ]}
  />
);

export const WithValidation = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: "name",
            type: "Input",
            validation: {
              required: true,
              errorMessage: "This if is empty ",
            },
          },
        ],
      },
    ]}
  />
);

export const WithRegexEmail = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: "name",
            type: "Input",
            validation: {
              regexType: "email",
              errorMessage: "No es un mail",
            },
          },
        ],
      },
    ]}
  />
);

export const WithCustomValidation = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: "name",
            type: "Input",
            validation: {
              custom: (props: any) => {
                console.log(props);

                return {
                  valid: props.name == "hello",
                  errorMessage: "is not hello",
                };
              },
            },
          },
        ],
      },
    ]}
  />
);

// export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

// export const Emoji = () => (
//   <Button onClick={action('clicked')}>
//     <span role="img" aria-label="so cool">
//       😀 😎 👍 💯
//     </span>
//   </Button>
// );
