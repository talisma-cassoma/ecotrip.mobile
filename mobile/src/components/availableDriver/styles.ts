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
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-around",
    alignItems: "center",
    margin: 16,
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
    color: colors.gray[400],
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32, // 100% of width/height
    backgroundColor: colors.gray[200],
    margin: 8,
  },
})
