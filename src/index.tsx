import Core, { GetComponent } from "./lib/core";
import ReactDForm from "./react-web";
import { withError } from "./helpers/getError";
import { IFormComponent } from "./types";
export type FormComponent = IFormComponent;
// import ReactNativeDForm from "./src/react-native";

export default Core;

export { GetComponent, ReactDForm, withError };
