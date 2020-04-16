import React from "react";
import { IFormComponent } from "../types";

const getErrorMessage = (validation: any, name: string) => {
  if (validation) {
    return validation[name] && validation[name].errorMessage
      ? validation[name].errorMessage
      : "Required";
  }

  return "";
};

const getValidation = (
  validation: any,
  name: string,
  showValidation: boolean
) => {
  if (showValidation && validation) {
    if (validation[name] && !validation[name].isValid) {
      return "error";
    } else {
      return null;
    }
  }

  return null;
};

const getError = (
  name: string,
  showValidation: boolean,
  usedFields: any,
  validation: any
) => {
  // return false

  let valid = getValidation(validation, name, true);
  const errorMessage = getErrorMessage(validation, name);

  if (usedFields && usedFields.includes(name) && valid == "error") {
    return { content: errorMessage };
  }

  return showValidation && valid == "error" ? { content: errorMessage } : false;
};

export const withError = <P extends {}>(Comp: React.ComponentType<P>) => {
  return (props: IFormComponent): any => {
    const error = getError(
      props.name,
      props.showValidation == true,
      props.usedFields,
      props.validation
    ) as { content: string } | undefined;

    return <Comp {...props} error={error} />;
  };
};
