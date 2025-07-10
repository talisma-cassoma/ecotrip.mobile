import { StyleSheet } from "react-native"
import { colors, fontFamily } from "@/styles/theme"
import { icons } from "@tabler/icons-react-native"

export const styles = StyleSheet.create({
  container: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    padding: 8,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconsStyles:{
    margin: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.gray[400],
  },
  name: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.green.dark,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 32
  },
})
