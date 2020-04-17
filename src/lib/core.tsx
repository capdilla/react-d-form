import React, { Component, PureComponent } from "react";
import { Props, Tfield, TdefaultState } from "../types";
import regex from "./regex";

import { get as get_ } from "lodash";

type Tvalidation = {
  isValid: boolean;
  errorMessage: string;
};

interface IValidation {
  [key: string]: Tvalidation;
}

interface IfieldState {
  ISFORMVALID: boolean;
  [key: string]: any;
}

interface IState {
  fieldsState: IfieldState;
  validation: IValidation;
  usedFields: string[];
  oldState: IfieldState;
}

/**
 *  TODO Send only the required props
 * @param FormComponentes
 * @param props
 */
export const GetComponent = (FormComponentes: any, props: any) => {
  if (props.component == null) {
    const Elm = FormComponentes[props.field.type];

    if (
      (props.field.type == "Input" || props.field.type == "TextArea") &&
      props.executeChangeOnBlur
    ) {
      return (
        <Elm
          onChange={(val: any) => props.onFieldsChange(props.field, val, false)}
          onBlur={(val: any) => props.onFieldsChange(props.field, val, true)}
          executeChangeOnBlur
          {...props}
          {...props.field}
        />
      );
    }

    return (
      <Elm
        onChange={(val: any) => props.onFieldsChange(props.field, val, true)}
        {...props}
        {...props.field}
      />
    );
  } else {
    //the output state, the state of the form , onChange
    const Elm = props.component(
      props.fieldsState,
      props.defaultState,
      (data: any) => props.onFieldsChange(props.field, data, true),
      props.showValidation
    );
    return Elm;
  }
};

export default class Core extends PureComponent<Props, IState> {
  static defaultProps: Partial<Props>;

  propsHasChange: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      fieldsState: {
        ISFORMVALID: true,
      },
      validation: {},
      usedFields: [],
      oldState: {
        ISFORMVALID: true,
      },
    };

    this.onFieldsChange = this.onFieldsChange.bind(this);
    this.getDataDependsOn = this.getDataDependsOn.bind(this);
    this.rows = this.rows.bind(this);
    this.fieldFn = this.fieldFn.bind(this);
  }

  getSnapshotBeforeUpdate(prevProps: Props) {
    if (
      (this.props.fields.length > 0 &&
        Object.keys(this.state.fieldsState).length == 0) ||
      JSON.stringify(prevProps.defaultState) !=
        JSON.stringify(this.props.defaultState) ||
      JSON.stringify(prevProps.fields) != JSON.stringify(this.props.fields)
    ) {
      this.generateValues();
    }

    return null;
  }

  componentDidMount() {
    this.generateValues();
  }

  generateValues(nextProps?: Props) {
    // let defaultState: TdefaultState, parseState, fields;

    const { defaultState, parseState, fields } = this.props;

    const { fieldsState, usedFields } = this.state;

    const defaultStateIsNotEmpty: boolean =
      Object.keys(defaultState ? defaultState : {}).length > 0;

    const newState = fields.reduce(
      (acc, { fields }) => {
        //   const fFields =
        //     typeof fields.fields == "function"
        //       ? fields.fields(fieldsState)
        //       : fields.fields;

        const fFields = typeof fields == "function" ? fields({}) : fields;

        fFields.reduce(
          (accField, currField) => {
            let val = currField.value ? currField.value : "";

            //if already have state
            if (val == "" && fieldsState[currField.name]) {
              val = fieldsState[currField.name];
            }

            //set defaultState
            if (defaultState && defaultStateIsNotEmpty) {
              //parseState

              val = defaultState[currField.name]
                ? defaultState[currField.name]
                : currField.type === "Checkbox"
                ? false
                : null;
            }

            val = this.parseValue(currField, val);

            /**
             * returnOnlyValue prop maybe this never has been use
             */

            const validation = this.validateField(currField, val);

            acc.validations = {
              ...acc.validations,
              [currField.name]: {
                ...validation,
              },
            };

            acc.state = { ...acc.state, [currField.name]: val };

            return accField;
          },
          { validation: {}, state: {} }
        );

        return acc;
      },
      { validations: {}, state: {} }
    );

    const ISFORMVALID = this.getISFORMVALID(newState.validations);

    const newFieldsState = {
      ...newState.state,
      ISFORMVALID,
    };

    const state = {
      validation: newState.validations,
      fieldsState: newFieldsState,
      oldState: fieldsState,
    };

    if (JSON.stringify(state.oldState) != JSON.stringify(state.fieldsState)) {
      this.setState(state);

      if (this.props.fields.length && this.props.onFormChange) {
        this.props.onFormChange(newFieldsState);
      }
    }
  }

  private getISFORMVALID(validations: IValidation): boolean {
    return !Object.entries(validations).some(
      ([name, xValidation]) => !xValidation.isValid
    );
  }

  private parseValue<T>(field: Tfield, val: T): T {
    //parse val tu number
    if (
      field.props &&
      typeof field.props.type != "undefined" &&
      field.props.type == "number" &&
      !val
    ) {
      return parseFloat(val);
    }

    return val;
  }

  private validateField<T>(field: Tfield, val: T): Tvalidation {
    const { fieldsState, validation, usedFields } = this.state;

    let ISFORMVALID: boolean = true;
    let isValid: boolean = true;
    let errorMessage = field.validation?.errorMessage;

    //check if is required
    if (field.validation?.required && !val) {
      ISFORMVALID = false;
      isValid = false;
    }

    //check regex
    if (field.validation?.regexType) {
      const result = val && val.match(regex[field.validation?.regexType]);

      if (!result) {
        ISFORMVALID = false;
        isValid = false;
      }
    }

    //check custom validation
    if (field.validation?.custom) {
      const result = field.validation.custom({
        ...fieldsState,
        [field.name]: val,
      });

      if (typeof result == "object") {
        errorMessage = result.errorMessage;
        isValid = result.valid;
      }

      if (typeof result == "boolean" && !result) {
        isValid = false;
        ISFORMVALID = false;
      }
    }

    return {
      ...validation[field.name],
      isValid,
      errorMessage: errorMessage ? errorMessage : "This field is required",
    };
  }

  onFieldsChange(field: Tfield, val: any, doOnChange: boolean) {
    const { validation, usedFields, fieldsState } = this.state;

    const value = this.parseValue(field, val);

    const validationField = this.validateField(field, value);

    const newValidation = {
      ...validation,
      [field.name]: validationField,
    };

    const ISFORMVALID = this.getISFORMVALID(newValidation);

    //use for know if the the field was used
    let newUsedFields = [...usedFields];
    if (!usedFields.includes(field.name)) {
      newUsedFields = [...usedFields, field.name];
    }

    let newState = {
      ...fieldsState,
      [field.name]: val === "" ? null : val,
      ISFORMVALID,
    };

    this.setState({
      fieldsState: newState,
      validation: newValidation,
      usedFields: newUsedFields,
    });

    if (doOnChange && this.props.onFormChange) {
      this.props.onFormChange(newState);
    }
  }

  getDataDependsOn(field: Tfield) {
    if (field.dataDependsOn) {
      const data = get_(this.state.fieldsState, field.dataDependsOn);
      return data ? data : [];
    }
  }

  getValue(field: Tfield) {
    const { fieldsState, oldState } = this.state;

    if (field.dataDependsOn) {
      const fieldDepends = field.dataDependsOn.split(".")[0];
      const current = get_(fieldsState, fieldDepends);
      const old = get_(oldState, fieldDepends);
      if (JSON.stringify(current) !== JSON.stringify(old)) {
        // fieldsState[typeField.name] = null;//prevent do this, just in extrme cases;
        return null;
      } else {
        return fieldsState[field.name];
      }
    } else {
      return fieldsState[field.name];
    }
  }

  rows(rowChild: any) {
    const { fields } = this.props;

    const { fieldsState } = this.state;

    return fields.map((field, rowKey) => {
      const rowFields =
        typeof field.fields == "function"
          ? field.fields(fieldsState)
          : field.fields;

      return rowChild({ rowFields, rowKey });
    });
  }

  fieldFn(rows: { rowFields: Tfield[] }, cb: Function) {
    const { showValidation, executeChangeOnBlur, defaultState } = this.props;

    const { validation, fieldsState, usedFields } = this.state;

    return rows.rowFields.map((typeField, key2) =>
      cb(
        {
          data: this.getDataDependsOn(typeField),

          value: this.getValue(typeField),
          fieldsState: fieldsState,
          onFieldsChange: this.onFieldsChange,
          validation: validation,
          showValidation: showValidation,
          executeChangeOnBlur: executeChangeOnBlur,
          defaultState: defaultState,
          usedFields: usedFields,
          field: typeField,
        },
        key2
      )
    );
  }

  render() {
    return <div></div>;
  }
}

Core.defaultProps = {
  fields: [],
  onFormChange: () => {},
  executeChangeOnBlur: true,
  defaultState: {},
  parseState: () => {},
  showValidation: false,
};
