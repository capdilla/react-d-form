import Core, { GetComponent } from "./src/lib/core";
import ReactDForm from "./src/react-web";
import { withError } from "./src/helpers/getError";
import { IFormComponent } from "./src/types";
type FormComponent = IFormComponent;
// import ReactNativeDForm from "./src/react-native";

export default Core;

export { GetComponent, ReactDForm, withError, FormComponent };
