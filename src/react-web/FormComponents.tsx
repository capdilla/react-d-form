import React from "react";
import { withError } from "../helpers/getError";
import { IFormComponent } from "../types";

interface Iinput extends IFormComponent {
  onBlur: (value: any) => any;
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
      error,
    }: Iinput) => {
      return (
        <>
          <label>{label}</label>
          <input
            value={value}
            placeholder={placeholder}
            name={name}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur(e.target.value)}
            {...props}
          />

          {error && <label style={{ color: "red" }}>{error.content}</label>}
        </>
      );
    }
  ),
};

export default Components;
