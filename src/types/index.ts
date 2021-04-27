import React from "react";
import Regexs from "../lib/regex";

export interface Ifield<T> {
  name: keyof T;
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
  colSize?: number | string;
  component?: (
    formData: T,
    defaultState: T,
    onChange: (data: any, field?: keyof T) => void,
    showValidations: boolean
  ) => React.ReactElement;
  validation?: IValidation<T>;
  [key: string]: any;
}

export type TCustomResult = {
  valid: boolean;
  errorMessage: string;
};

export interface IValidation<T> {
  required?: boolean;
  regexType?: keyof typeof Regexs;
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
  usedFields?: string[];
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  error?: { content: string };
  validationForm: any;
}

interface FormClass extends React.ComponentClass<Props<any>> {}

declare const Form: FormClass;

export default Form;
