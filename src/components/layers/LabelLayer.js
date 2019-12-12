import React from "react";

function LabelLayer(props) {
  return (
    <g className={"labelsGroup"}>
      {props.data.map((d, i) => (
        <text
          key={i}
          x={props.projector.centroid(d.geometry)[0] * 0.99}
          y={props.projector.centroid(d.geometry)[1] * 1.01}
        >
          <tspan className={props.classes.label}>
            {props.labels
              ? props.labels.indexOf(d.properties.defaultLabel) >= 0
                ? d.properties.defaultLabel
                : ""
              : d.properties.defaultLabel}
          </tspan>
        </text>
      ))}
    </g>
  );
}

export default LabelLayer;
