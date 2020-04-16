import react, { Component } from "react";

export type Tfield = {
  name: string;
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
  validation?: IValidation;
  [key: string]: any;
};

export type TCustomResult = {
  valid: boolean;
  errorMessage: string;
};

export interface IValidation {
  required?: boolean;
  regexType?: "email" | "phone";
  errorMessage?: string;
  custom?: (values: any) => boolean | TCustomResult;
}

export interface IFields {
  div?: string;
  fields: ((values: any) => Tfield[]) | Tfield[];
}

export type TdefaultState = {
  [key: string]: any;
};

export interface Props {
  fields: IFields[];
  onFormChange?: Function;
  showValidation?: boolean;
  defaultState?: TdefaultState;
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
}

interface FormClass extends react.ComponentClass<Props> {}

declare const Form: FormClass;

export default Form;
