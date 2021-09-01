import React, { useRef, useState } from 'react'
import { Fields, FormData } from '../src'

import DForm from '../src/react-web'

export default {
  title: 'Basic',
  // component: Button,
}

export const Basic = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: 'name',
            placeholder: 'Name',
            type: 'Input',
            props: {
              onKeyPress: (e) => {
                if (e.which == 32) {
                  e.preventDefault()
                  console.log('Space Detected')
                  return false
                }
              },
            },
          },
        ],
      },
    ]}
  />
)

export const WithValidation = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: 'name',
            type: 'Input',
            validation: {
              required: true,
              errorMessage: 'This if is empty ',
            },
          },
        ],
      },
    ]}
  />
)

export const WithRegexEmail = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: 'name',
            type: 'Input',
            validation: {
              regexType: 'email',
              errorMessage: 'No es un mail',
            },
          },
        ],
      },
    ]}
  />
)

interface FormType {
  name: string
}

const fields: Fields<FormType>[] = [
  {
    fields: [
      {
        name: 'name',
        type: 'Input',
        validation: {
          regexType: 'email',
          errorMessage: 'No es un mail',
        },
      },
    ],
  },
]

export const WithTypescript = () => (
  <DForm fields={fields} onFormChange={(val) => console.log(val)} />
)

export const WithCustomValidation = () => (
  <DForm
    fields={[
      {
        fields: [
          {
            name: 'name',
            type: 'Input',
            validation: {
              custom: (props) => {
                console.log(props)

                return {
                  valid: props.name == 'hello',
                  errorMessage: 'is not hello',
                }
              },
            },
          },
        ],
      },
    ]}
  />
)

interface WithCustomComponentState {
  name: string
  surname: string
  age: number
}
export const WithCustomComponent = () => {
  const [state, setState] = useState<FormData<WithCustomComponentState>>({
    data: { age: 0, name: 'John', surname: '' },
    validation: {
      isFormValid: true,
    },
  })

  return (
    <>
      <h1> the age is {state.data.age}</h1>
      <DForm
        defaultState={state.data}
        onFormChange={(s) => setState(s)}
        fields={[
          {
            fields: [
              {
                name: 'name',
                type: '',
                component: (state, defaultState, onChange) => (
                  <>
                    hello {state.name}
                    <button
                      onClick={() => onChange(new Date().getTime(), 'name')}
                    >
                      change value
                    </button>
                    <button
                      onClick={() => onChange(defaultState.age + 1, 'age')}
                    >
                      change age {defaultState.age}
                    </button>
                  </>
                ),
              },
              {
                name: 'surname',
                type: '',
                component: (state, defaultState, onChange) => (
                  <>
                    hello {state.surname}
                    <button onClick={() => onChange('Doe')}>
                      change value
                    </button>
                  </>
                ),
              },
              {
                // if you need to change this value from anther field you have to declare this field
                name: 'age',
                type: '',
                component: () => null,
              },
            ],
          },
        ]}
      />
    </>
  )
}

interface WithRef {
  name: string
  surname: string
  age: number
}
export const WithRef = () => {
  const formRef = useRef<DForm<WithRef> | null>(null)
  const [state, setState] = useState<FormData<WithRef>>({
    data: { age: 0, name: 'John', surname: '' },
    validation: {
      isFormValid: true,
    },
  })

  const onClick = () => {
    if (formRef.current) {
      console.log(formRef.current.state.validationForm.age.isValid)
    }
  }

  return (
    <>
      <h1> the age is {state.data.age}</h1>
      <button onClick={onClick}>Click</button>
      <DForm
        ref={formRef}
        defaultState={state.data}
        onFormChange={(s) => setState(s)}
        fields={[
          {
            fields: [
              {
                name: 'name',
                type: '',
                component: (state, defaultState, onChange) => (
                  <>
                    hello {state.name}
                    <button
                      onClick={() => onChange(new Date().getTime(), 'name')}
                    >
                      change value
                    </button>
                    <button
                      onClick={() => onChange(defaultState.age + 1, 'age')}
                    >
                      change age {defaultState.age}
                    </button>
                  </>
                ),
              },
              {
                name: 'surname',
                type: '',
                component: (state, defaultState, onChange) => (
                  <>
                    hello {state.surname}
                    <button onClick={() => onChange('Doe')}>
                      change value
                    </button>
                  </>
                ),
              },
              {
                // if you need to change this value from anther field you have to declare this field
                name: 'age',
                type: '',
                component: () => null,
              },
            ],
          },
        ]}
      />
    </>
  )
}

// export const Text = () => <Button onClick={action('clicked')}>Hello Button</Button>;

// export const Emoji = () => (
//   <Button onClick={action('clicked')}>
//     <span role="img" aria-label="so cool">
//       😀 😎 👍 💯
//     </span>
//   </Button>
// );
