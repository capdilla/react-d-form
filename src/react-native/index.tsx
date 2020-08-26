// import React from "react";

// import Core, { GetComponent } from "../lib/core";

//WP

// import { View, StyleSheet } from "react-native";
// import FormComponents from "../FormComponents";

// const Elm = (props: any) => GetComponent(FormComponents, props);

// export default class Form extends Core {
//   render() {
//     return (
//       <>
//         {this.rows((rows: any) => (
//           <View style={styles.row}>
//             {this.fieldFn(rows, (r: any, key: number) => (
//               <Elm key={key} {...r} />
//             ))}
//           </View>
//         ))}
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   row: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     right: 20,
//   },
// });
