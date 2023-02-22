import React from 'react'
import Regexs from '../lib/regex'

export interface Field<T> {
  name: keyof T
  label?: string
  placeholder?: string
  type:
    | 'Input'
    | 'Select'
    | 'DatePicker'
    | 'DateTimePicker'
    | 'Switch'
    | 'TextArea'
    | 'Label'
    | 'RadioButtons'
    | 'Null'
    | 'Divider'
    | any
  value?: any
  props?: any
  component?: (
    formData: T,
    defaultState: T,
    onChange: (data: any, field?: keyof T) => void,
    showValidations: boolean,
  ) => React.ReactElement
  validation?: Validation<T>
  [key: string]: any
}

export type CustomResult = {
  valid: boolean
  errorMessage: string
}

export interface Validation<T> {
  required?: boolean
  regexType?: keyof typeof Regexs
  errorMessage?: string
  custom?: (values: T) => boolean | CustomResult
}

export interface Fields<T> {
  div?: string
  fields: ((values: T) => Field<T>[]) | Field<T>[]
}

export type DefaultState = {
  [key: string]: any
}

export interface FormData<T> {
  data: T
  validation: { isFormValid: boolean }
}
export interface Props<T> {
  fields: Fields<T>[]
  onFormChange?: (formData: FormData<T>) => void
  showValidation?: boolean
  defaultState?: T
  parseState?: Function
  executeChangeOnBlur?: boolean
  executeDebounceChange?: boolean
  delayToDebounceChange?: number
}

export interface FormComponent {
  label?: string
  value?: any
  onChange: (value: any) => any
  name: string
  placeholder?: string
  props?: any
  validation?: any
  showValidation?: boolean
  usedFields?: string[]
  error?: { content: string }
  validationForm: any
}
