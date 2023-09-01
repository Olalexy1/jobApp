import { StyleSheet, ViewStyle } from "react-native";

import { COLORS, SHADOWS, SIZES } from "../../../constants";

type tabStyle = (activeTab : any, name: any) => ViewStyle;

export type Styles = {
  tab: tabStyle;
};

const styles = StyleSheet.create<Styles | any>({
  container: {
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
  },
  btn: (name: any, activeTab: any) => ({
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    backgroundColor: name === activeTab ? COLORS.primary : "#F3F4F8",
    borderRadius: SIZES.medium,
    marginLeft: 2,
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  }),
  btnText: (name: any, activeTab: any) => ({
    fontFamily: "DMMedium",
    fontSize: SIZES.small,
    color: name === activeTab ? "#C3BFCC" : "#AAA9B8",
  }),
});

export default styles;
