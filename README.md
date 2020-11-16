# DForm

### React Form Builder

build easy and powerfull forms with this library

## Features

- ReactJs and React Native support
- Strong Validation
- Write your Form Componets once use any times
- Easy to handle state
- is not needed Yup, Superstruct, Joi

## Table of content

- [Installation](#Installation)

- [ Basic Use](#basic-use)

- [Create Custom Form](#create-custom-form)

  - [`1st Step` create a new component](#1st-step-create-a-new-component)
  - [`2nd Step` create yours custom components](#2nd-Step-create-yours-custom-components)
  - [`3rd Step (optional)` create form.d.ts](<#3rd-step-(optional)-create-form.d.ts>)
  - [`4th Step` use your custom Form component](#4th-Step-use-your-custom-Form-component)

- [Add Typescript Support](#Add-Typescript-Support)

  - [`1st Step` Add Generic type to Form Component](#1st-Step-Add-Generic-type-to-Form-Component)
  - [`2nd Step` add typescript support to FormComponents](#2nd-Step-add-typescript-support-to-FormComponents)

- [Validate Form](#Validate-Form)

  - [Required field](#required-field)
  - [Custom error message](#Custom-error-message)
  - [Validate by regex](#Validate-by-regex)
  - [Validate by custom validation](#Validate-by-custom-validation)

- [Handle state and values](#Handle-state-and-values)
  - [Get Async values](#Get-Async-values)

# How To use

## Installation

```bash
npm i @capdilla/react-d-form
```

## Basic Use

```jsx
import { ReactDForm } from "@capdilla/react-d-form";

const App = () => (
  <ReactDForm
    defaultState={{ name: "John" }}
    onFormChange={formValues => {
      if (formValues.validation.ISFORMVALID) {
        console.log("The form is valid");
      } else {
        console.log("Form is not valid");
      }

      console.log(formValues.data.email);
      console.log(formValues.data.name);
      console.log(formValues.data.surname);
    }}
    fields={[
      {
        fields: [
          {
            name: "name",
            type: "Input",
            validation: { required: true }
          },
          {
            name: "surname",
            type: "Input",
            validation: { required: true }
          }
        ]
      },
      {
        fields: [
          {
            name: "email",
            type: "Input",
            props: { type: "email" }
          }
        ]
      }
    ]}
  />
);
```

this example will create a form with two inputs in a row and one input in a second row, the input with the name `email` will going to be a `<input type=email/>`

## Create Custom Form

this example use reactstrap but you can use any css library

### `1st Step` create a new component

```jsx
import React from "react";
import Core, { GetComponent } from "@capdilla/react-d-form";
import { Row } from "reactstrap";

import FormComponents from "../FormComponents";

const Elm = props => GetComponent(FormComponents, props);

export default class Form extends Core {
  render() {
    return (
      <div className="av-tooltip tooltip-label-right">
        <Row>
          {this.rows(rows => (
            <>
              {this.fieldFn(rows, (r, key) => (
                <Elm key={key} {...r} />
              ))}
            </>
          ))}
        </Row>
      </div>
    );
  }
}
```

Is mandatory to implement `this.rows` and `this.fieldFn`

### `2nd Step` create yours custom components

this going to be the FormComponents file

```jsx
import React, { useMemo } from "react";

import { withError } from "@capdilla/react-d-form";
import { FormGroup, Label, Col } from "reactstrap";
import Select from "react-select";

const Components = {
  Input: withError(
    ({ name, label, onChange, onBlur, props, value, placeholder, error }) => {
      return (
        <Col>
          <FormGroup className="form-group has-float-label">
            <Label>{label}</Label>
            <input
              className="form-control"
              value={value}
              placeholder={placeholder}
              name={name}
              onChange={e => onChange(e.target.value)}
              onBlur={e => onBlur(e.target.value)}
              {...props}
            />
            {error && (
              <div className="invalid-feedback d-block">{error.content}</div>
            )}
          </FormGroup>
        </Col>
      );
    }
  ),
  Select: withError(
    ({
      name,
      label,
      onChange,
      onBlur,
      props,
      value,
      placeholder,
      error,
      options
    }) => {
      const indexedValues = useMemo(
        () =>
          options.reduce(
            (acc, option) => ({ ...acc, [option.value]: option }),
            {}
          ),
        [options]
      );

      return (
        <Col>
          <FormGroup className="form-group has-float-label">
            <Label>{label}</Label>
            <Select
              className={`react-select `}
              classNamePrefix="react-select"
              options={options}
              onChange={e => onChange(e.value)}
              value={indexedValues[value]}
            />
            {error && (
              <div className="invalid-feedback d-block">{error.content}</div>
            )}
          </FormGroup>
        </Col>
      );
    }
  )
};

export default Components;
```

### `3rd Step (optional)` create form.d.ts

The name of this file should be the same name of the file created in the 1st STEP

This step is optional but it going to improve the `TypeScript` support for your Form component (1st STEP)

```ts
/// <reference types="react" />
import Core from "@capdilla/react-d-form";
export default class Form<T> extends Core<T> {
  render(): JSX.Element;
}
```

### `4th Step` use your custom Form component

```jsx
import Form from "../components/Form";

const App = () => (
  <Form
    fields={[
      {
        fields: [
          {
            name: "name",
            type: "Input",
            validation: { required: true }
          }
        ]
      }
    ]}
  />
);
```

## Add Typescript Support

### `1st Step` Add Generic type to Form Component

this it the same

```jsx
export default class Form<T> extends Core<T> {
  //render implementation here
}
```

### `2nd Step` add typescript support to FormComponents

```jsx
import { FormComponent } from "@capdilla/react-d-form";

interface Iinput extends FormComponent {
  onBlur: (value: any) => any;
}

interface ISelect extends FormComponent {
  options: {
    label: string,
    value: string
  }[];
}

const Components = {
  Input: withError(
    ({
      name,
      label,
      onChange,
      onBlur,
      props,
      value,
      placeholder,
      error
    }: Iinput) => {
      return (
        <Col>
          <FormGroup className="form-group has-float-label">
            <Label>{label}</Label>
            <input
              className="form-control"
              value={value}
              placeholder={placeholder}
              name={name}
              onChange={e => onChange(e.target.value)}
              onBlur={e => onBlur(e.target.value)}
              {...props}
            />
            {error && (
              <div className="invalid-feedback d-block">{error.content}</div>
            )}
          </FormGroup>
        </Col>
      );
    }
  ),
  Select: withError(
    ({
      name,
      label,
      onChange,
      onBlur,
      props,
      value,
      placeholder,
      error,
      options
    }: ISelect) => {
      const indexedValues = useMemo(
        () =>
          options.reduce(
            (acc, option) => ({ ...acc, [option.value]: option }),
            {}
          ),
        [options]
      );

      return (
        <Col>
          <FormGroup className="form-group has-float-label">
            <Label>{label}</Label>
            <Select
              className={`react-select `}
              classNamePrefix="react-select"
              options={options}
              onChange={e => onChange(e.value)}
              value={indexedValues[value]}
            />
            {error && (
              <div className="invalid-feedback d-block">{error.content}</div>
            )}
          </FormGroup>
        </Col>
      );
    }
  )
};

export default Components;
```

## Validate Form

### Required field

```jsx
<Form
  fields={[
    {
      fields: [
        {
          name: "name",
          type: "Input",
          validation: { required: true }
        }
      ]
    }
  ]}
/>
```

### Custom error message

`errorMessage` is not requied by default the Form component will return `FIELD_REQUIRED`

```jsx
<Form
  fields={[
    {
      fields: [
        {
          name: "name",
          type: "Input",
          validation: {
            required: true,
            errorMessage: "This field cannot be empty"
          }
        }
      ]
    }
  ]}
/>
```

### Validate by regex

in this example will validate if the input is an email

```jsx
<Form
  fields={[
    {
      fields: [
        {
          name: "email",
          type: "Input",
          validation: {
            regexType: "email",
            errorMessage: "is not an email"
          }
        }
      ]
    }
  ]}
/>
```

others regex availables

| Regex type |                                                                          description                                                                           |
| ---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `email`    |                                                                       validate an email                                                                        |
| `phone`    |                                                                       validate an phone                                                                        |
| `number`   |                                                                    validate if is a number                                                                     |
| `double`   |                                                             validate if is a number with decimals                                                              |
| `password` | validate password with next requisits: must contain at least eight characters, at least one number and both lower and uppercase letters and special characters |

### Validate by custom validation

```jsx
<Form
  fields={[
    {
      fields: [
        {
          name: "email",
          type: "Input",
          validation: {
            custom: values => ({
              valid: values.email === "hello@mail.com",
              errorMessage: "Email must be hello@mail.com"
            })
          }
        }
      ]
    }
  ]}
/>
```

## Handle state and values

### Get Async values

```jsx
const TestForm = () => {
  const [formData, setFormData] = useState({});

  const getData = () => {
    setTimeout(() => {
      setFormData({ formData: { name: "Jonh", surname: "Doe", age: 20 } });
    }, 2000);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Form
      defaultState={formData}
      onFormChange={data => {
        setFormData(data);
      }}
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
```

For more examples see **/stories** folder
