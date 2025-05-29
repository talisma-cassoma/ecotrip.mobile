import React from "react";
import * as Svg from "react-native-svg";

type IVerticalDashedLine = {
  height: number;
  width: number;
  color: string;
};

export default function VerticalDashedLine({
  height,
  width,
  color,
}: IVerticalDashedLine) {
  return (
    <Svg.Svg height={height} width={width} style={{ alignSelf: "center" }}>
      <Svg.Line
        stroke={color}
        strokeWidth={width}
        strokeDasharray="3, 2"
        x1="0"
        y1="0"
        x2="0"
        y2={height}
      />
    </Svg.Svg>
  );
}