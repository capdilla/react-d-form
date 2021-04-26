import Core, { GetComponent } from "./lib/core";
import ReactDForm from "./react-web";
import { withError } from "./helpers/getError";
import { IFormComponent, IFormData, IFields } from "./types";
export type FormComponent = IFormComponent;

export default Core;

export { GetComponent, ReactDForm, withError, IFormData, IFields };
