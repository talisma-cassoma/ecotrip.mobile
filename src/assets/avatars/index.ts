import { ImageSourcePropType } from "react-native";

// export const avatars = [
//   "https://cdn-icons-png.freepik.com/512/4825/4825108.png",
//   "https://cdn-icons-png.freepik.com/512/4825/4825112.png",
//   "	https://cdn-icons-png.freepik.com/512/4825/4825057.png?ga=GA1.1.451429218.1765634666",
//   "https://cdn-icons-png.freepik.com/512/4825/4825057.png?ga=GA1.1.451429218.1765634666",
//   "https://cdn-icons-png.freepik.com/512/4825/4825015.png"
// ];
	
import { Image } from "react-native";

export const avatars = [
  {
    id: "1",
    uri: Image.resolveAssetSource(require("./young_black_man.png")).uri,
  },
  {
    id: "2",
    uri: Image.resolveAssetSource(require("./young_black-woman.png")).uri,
  },
  {
    id: "3",
    uri: Image.resolveAssetSource(require("./black_hair_white_woman.png")).uri,
  },
  {
    id: "4",
    uri: Image.resolveAssetSource(require("./blond_white_woman.png")).uri,
  },
  {
    id: "5",
    uri: Image.resolveAssetSource(require("./old_man.png")).uri,
  },
];