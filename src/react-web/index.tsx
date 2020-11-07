import React from "react";
import Core, { GetComponent } from "../lib/core";
import FormComponents from "./FormComponents";

const Elm = (props: any) => GetComponent(FormComponents, props);

export default class Form<T> extends Core<T> {
  render() {
    return (
      <div>
        {this.rows((rows: any) => (
          <div>
            {this.fieldFn(rows, (r: any, key: any) => (
              <Elm key={key} {...r} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
