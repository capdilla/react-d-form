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
      colSize,
      onBlur,
      iconName,
      iconSize,
      iconColor,
      props,
      value,
      placeholder,
      showValidation,
      usedFields,
      validation,
      error,
    }: Iinput) => {
      const width = colSize ? `${colSize}%` : `100%`;

      return (
        <View
          style={{
            width,
            flexDirection: "row",
            marginHorizontal: 15,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {iconName && (
              <Icon name={iconName} size={iconSize} color={iconColor} />
            )}
          </View>

          <View
            style={{
              height: 70,
              marginVertical: 5,
              marginHorizontal: 15,
              width: "100%",
            }}
          >
           <Inpu
            {error && (
              <TText style={{ color: colors.secondary4, top: 5 }}>
                {error.content}
              </TText>
            )}
          </View>
        </View>
      );
    }
  ),
};

export default Components;
