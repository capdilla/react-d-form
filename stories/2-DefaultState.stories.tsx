import React, { useState, useEffect } from "react";
import { action } from "@storybook/addon-actions";
import { Button } from "@storybook/react/demo";

import DForm from "../src/react-web";

export default {
  title: "Default State"
  // component: Button,
};

const TestForm = () => {
  const [formData, setFormData] = useState({});

  console.log(formData);

  return (
    <DForm
      defaultState={{ name: "Jonh", surname: "Doe", age: 20 }}
      onFormChange={data => setFormData(data)}
      fields={[
        {
          fields: [
            {
              name: "name",
              type: "Input"
            },
            {
              name: "surname",
              type: "Input"
            }
          ]
        },
        {
          fields: [
            {
              name: "age",
              type: "Input"
            }
          ]
        }
      ]}
    />
  );
};

export const DefaultState = () => <TestForm />;

class Asynccc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ formData: { name: "Jonh", surname: "Doe", age: 20 } });
    }, 2000);
  }

  render() {
    return (
      <DForm
        defaultState={this.state.formData ? this.state.formData : null}
        onFormChange={data => this.setState({ formData: data })}
        fields={[
          {
            fields: [
              {
                name: "name",
                type: "Input"
              },
              {
                name: "surname",
                type: "Input"
              }
            ]
          },
          {
            fields: [
              {
                name: "age",
                type: "Input"
              }
            ]
          }
        ]}
      />
    );
  }
}

export const DefaultStateAsync = () => <Asynccc />;
// export const DefaultStateAsync = () => {
//   const [stop, setStop] = useState(false);
//   const [formData, setFormData] = useState({});

//   console.log(formData);

//   useEffect(() => {
//     setTimeout(() => {
//       setFormData({ name: "Jonh", surname: "Doe", age: 20 });
//     }, 2000);
//   }, []);

//   return (

//   );
// };

// export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

// export const Emoji = () => (
//   <Button onClick={action('clicked')}>
//     <span role="img" aria-label="so cool">
//       😀 😎 👍 💯
//     </span>
//   </Button>
// );
