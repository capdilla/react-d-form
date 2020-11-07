import React from "react";

export interface Ifield<T> {
  name: keyof T | string;
  label?: string;
  placeholder?: string;
  type:
    | "Input"
    | "Select"
    | "DatePicker"
    | "DateTimePicker"
    | "Switch"
    | "TextArea"
    | "Label"
    | "RadioButtons"
    | "Null"
    | "Divider"
    | any;
  value?: any;
  data?: any[];
  returnOnlyValue?: boolean;
  props?: any;
  //colSize: 'two' | 'four' | 'six' | 'eight' | 'ten' | 'twelve' | 'fourteen' | 'sixteen',
  colSize?: number;
  component?: Function;
  validation?: IValidation<T>;
  [key: string]: any;
}

export type TCustomResult = {
  valid: boolean;
  errorMessage: string;
};

export interface IValidation<T> {
  required?: boolean;
  regexType?: "email" | "phone";
  errorMessage?: string;
  custom?: (values: T) => boolean | TCustomResult;
}

export interface IFields<T> {
  div?: string;
  fields: ((values: T) => Ifield<T>[]) | Ifield<T>[];
}

export type TdefaultState = {
  [key: string]: any;
};

export interface IFormData<T> {
  data: T;
  validation: { ISFORMVALID: boolean };
}
export interface Props<T> {
  fields: IFields<T>[];
  onFormChange?: (formData: IFormData<T>) => void;
  showValidation?: boolean;
  defaultState?: T;
  parseState?: Function;
  executeChangeOnBlur?: boolean;
}

export interface IFormComponent {
  label?: string;
  value?: any;
  onChange: (value: any) => any;
  name: string;
  colSize?: number;
  placeholder?: string;
  props?: any;
  validation?: any;
  showValidation?: boolean;
  usedFields?: any;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  error?: { content: string };
  validationForm: any;
}

interface FormClass extends React.ComponentClass<Props<any>> {}

declare const Form: FormClass;

export default Form;
