import React, { PureComponent } from 'react'
import { Props, Ifield } from '../types'
import regex from './regex'

import { get as get_ } from 'lodash'
import { hasKey } from '../helpers/hasKey'

export type Tvalidation = {
  isValid: boolean
  errorMessage: string
}

export type IValidation<T extends Record<string, any>> = {
  [K in keyof T]: Tvalidation
}

export interface IfieldState<T> {
  validation: IFieldsStateValidation
  data: T
}

export interface IFieldsStateValidation {
  ISFORMVALID: boolean
}

export interface IState<T> {
  fieldsState: IfieldState<T>
  validationForm: IValidation<T>
  usedFields: string[]
  oldState: IfieldState<T>
}

export interface RowChild<T> {
  rowKey: number
  rowFields: Ifield<T>[]
}

type RowChildFn<T> = (params: RowChild<T>) => React.ReactElement

/**
 *  TODO Send only the required props
 * @param FormComponentes
 * @param props
 */
export const GetComponent = (FormComponentes: any, props: any) => {
  if (props.field.component == null) {
    const Elm = FormComponentes[props.field.type]

    if (
      (props.field.type == 'Input' || props.field.type == 'TextArea') &&
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
      )
    }

    return (
      <Elm
        onChange={(val: any) => props.onFieldsChange(props.field, val, true)}
        {...props}
        {...props.field}
      />
    )
  } else {
    //the output state, the state of the form , onChange
    const Elm = props.field.component(
      props.fieldsState.data,
      props.defaultState,
      (data: any, field?: string) =>
        props.onFieldsChange(field ? { name: field } : props.field, data, true),
      props.showValidation,
    )
    return Elm
  }
}

export default class Core<T> extends PureComponent<Props<T>, IState<T>> {
  static defaultProps: Partial<Props<any>>

  propsHasChange: any

  constructor(props: Props<T>) {
    super(props)
    this.state = {
      fieldsState: {
        data: {} as T,
        validation: {
          ISFORMVALID: true,
        },
      },
      validationForm: {} as IValidation<T>,
      usedFields: [],
      oldState: {
        data: {} as T,
        validation: {
          ISFORMVALID: true,
        },
      },
    }

    this.onFieldsChange = this.onFieldsChange.bind(this)
    this.getDataDependsOn = this.getDataDependsOn.bind(this)
    this.rows = this.rows.bind(this)
    this.fieldFn = this.fieldFn.bind(this)
  }

  // do not delete getSnapshotBeforeUpdate required this
  componentDidUpdate() {}

  getSnapshotBeforeUpdate(prevProps: Props<any>) {
    if (
      (this.props.fields.length > 0 &&
        Object.keys(this.state.fieldsState).length == 0) ||
      JSON.stringify(prevProps.defaultState) !=
        JSON.stringify(this.props.defaultState) ||
      JSON.stringify(prevProps.fields) != JSON.stringify(this.props.fields)
    ) {
      this.generateValues()
    }

    return null
  }

  componentDidMount() {
    this.generateValues()
  }

  generateValues(_?: Props<any>) {
    const { defaultState, fields } = this.props
    const { fieldsState } = this.state

    const defaultStateIsNotEmpty: boolean =
      Object.keys(defaultState ? defaultState : {}).length > 0

    const newState = fields.reduce(
      (acc, { fields }) => {
        const fFields = typeof fields == 'function' ? fields({} as any) : fields

        fFields.reduce(
          (accField, currField) => {
            let val = currField.value ? currField.value : ''

            //if already have state
            if (
              typeof currField.name == 'string' &&
              hasKey(fieldsState.data, currField.name)
            ) {
              if (val == '' && fieldsState.data[currField.name]) {
                val = fieldsState.data[currField.name]
              }
            }

            //set defaultState
            if (
              defaultState &&
              defaultStateIsNotEmpty &&
              typeof currField.name == 'string' &&
              hasKey(defaultState, currField.name)
            ) {
              val = defaultState[currField.name]
            }

            val = this.parseValue(currField, val)

            /**
             * returnOnlyValue prop maybe this never has been use
             */

            const validation = this.validateField(currField, val)

            acc.validations = {
              ...acc.validations,
              [currField.name]: {
                ...validation,
              },
            }

            acc.state = { ...acc.state, [currField.name]: val }

            return accField
          },
          { validation: {}, state: {} as T },
        )

        return acc
      },
      { validations: {} as IValidation<T>, state: {} as T },
    )

    const ISFORMVALID = this.getISFORMVALID(
      newState.validations as IValidation<T>,
    )

    const newFieldsState: IfieldState<T> = {
      data: { ...newState.state },
      validation: { ISFORMVALID },
    }

    const state = {
      validationForm: newState.validations,
      fieldsState: newFieldsState,
      oldState: fieldsState,
    }

    if (JSON.stringify(state.oldState) != JSON.stringify(state.fieldsState)) {
      this.setState(state)

      if (this.props.fields.length && this.props.onFormChange) {
        this.props.onFormChange(newFieldsState)
      }
    }
  }

  private getISFORMVALID(validations: IValidation<T>): boolean {
    return !Object.entries<Tvalidation>(validations).some(
      ([_, xValidation]) => !xValidation.isValid,
    )
  }

  private parseValue(field: Ifield<any>, val: any): any {
    if (field.type === 'Checkbox' && !val) {
      return false
    }

    // if is number and is falsy
    if (
      field.props &&
      typeof field.props.type != undefined &&
      field.props.type == 'number' &&
      !val
    ) {
      return 0
    }

    //parse val tu number
    if (
      field.props &&
      typeof field.props.type != undefined &&
      field.props.type == 'number' &&
      val
    ) {
      return +val
    }

    return val
  }

  private validateField(field: Ifield<any>, val: any): Tvalidation {
    if (typeof field.name !== 'string') {
      return {
        isValid: false,
        errorMessage: 'FIELD_NOT_FOUND',
      }
    }

    const { fieldsState, validationForm } = this.state

    let isValid: boolean = true
    let errorMessage = field.validation?.errorMessage

    //check if is required
    if (field.validation?.required && !val) {
      isValid = false
    }

    //check regex
    if (field.validation?.regexType) {
      const result = val && val.match(regex[field.validation?.regexType])

      if (!result) {
        isValid = false
      }
    }

    //check custom validation
    if (field.validation?.custom) {
      const result = field.validation.custom({
        ...fieldsState.data,
        [field.name]: val,
      })

      if (typeof result == 'object') {
        errorMessage = result.errorMessage
        isValid = result.valid
      }

      if (typeof result == 'boolean' && !result) {
        isValid = false
      }
    }

    return {
      ...validationForm[field.name],
      isValid,
      errorMessage: errorMessage ? errorMessage : 'FIELD_REQUIRED',
    }
  }

  onFieldsChange(field: Ifield<any>, val: any, doOnChange: boolean) {
    const { validationForm, usedFields, fieldsState } = this.state

    const value = this.parseValue(field, val)

    const validationField = this.validateField(field, value)

    const newValidation = {
      ...validationForm,
      [field.name]: validationField,
    }

    const ISFORMVALID = this.getISFORMVALID(newValidation)

    //use for know if the the field was used
    let newUsedFields = [...usedFields]
    if (typeof field.name == 'string' && !usedFields.includes(field.name)) {
      newUsedFields = [...usedFields, field.name]
    }

    let newState: IfieldState<T> = {
      data: {
        ...fieldsState.data,
        [field.name]: val === '' ? null : val,
      },
      validation: { ISFORMVALID },
    }

    this.setState({
      fieldsState: newState,
      validationForm: newValidation,
      usedFields: newUsedFields,
    })

    if (doOnChange && this.props.onFormChange) {
      this.props.onFormChange(newState)
    }
  }

  getDataDependsOn(field: Ifield<any>) {
    if (field.dataDependsOn) {
      const data = get_(this.state.fieldsState, field.dataDependsOn)
      return data ? data : []
    }
  }

  getValue(field: Ifield<any>) {
    const { fieldsState, oldState } = this.state

    if (typeof field.name !== 'string') {
      return ''
    }

    if (field.dataDependsOn) {
      const fieldDepends = field.dataDependsOn.split('.')[0]
      const current = get_(fieldsState.data, fieldDepends)
      const old = get_(oldState.data, fieldDepends)
      if (JSON.stringify(current) !== JSON.stringify(old)) {
        // fieldsState[typeField.name] = null;//prevent do this, just in extrme cases;
        return null
      } else {
        return fieldsState.data[field.name]
      }
    } else {
      return fieldsState.data[field.name]
    }
  }

  rows(rowChild: RowChildFn<T>) {
    const { fields } = this.props
    const { fieldsState } = this.state

    return fields.map((field, rowKey) => {
      const rowFields =
        typeof field.fields == 'function'
          ? field.fields(fieldsState.data)
          : field.fields

      return rowChild({ rowFields, rowKey })
    })
  }

  fieldFn(rows: { rowFields: Ifield<T>[] }, cb: Function) {
    const { showValidation, executeChangeOnBlur, defaultState } = this.props

    const { validationForm, fieldsState, usedFields } = this.state

    return rows.rowFields.map((typeField, key2) =>
      cb(
        {
          data: this.getDataDependsOn(typeField),
          value: this.getValue(typeField),
          fieldsState,
          onFieldsChange: this.onFieldsChange,
          validationForm,
          showValidation,
          executeChangeOnBlur,
          defaultState,
          usedFields,
          field: typeField,
        },
        key2,
      ),
    )
  }

  render() {
    return <></>
  }
}

Core.defaultProps = {
  fields: [],
  onFormChange: () => {},
  executeChangeOnBlur: true,
  defaultState: {},
  parseState: () => {},
  showValidation: false,
}
