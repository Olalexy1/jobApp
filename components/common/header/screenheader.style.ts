import { StyleSheet, ViewStyle } from "react-native";

import { COLORS, SIZES } from "../../../constants";

type buttonStyle = (height: number, width: string, borderRadius: number) => ViewStyle;

export type Styles = {
  btnImg: buttonStyle;
};

const styles = StyleSheet.create<Styles | any>({
  btnContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small / 1.25,
    justifyContent: "center",
    alignItems: "center",
  },
  btnImg: (dimension: string) => ({
    width: dimension,
    height: dimension,
    borderRadius: SIZES.small / 1.25,
  }),
  header: {
    flex: 1,
    flexDirection:'row',
    justifyContent:"center"
  },
  headerText: {
    fontWeight: '600',
    color: COLORS.secondary
  }
});

export default styles;
