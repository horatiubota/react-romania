import React from "react";

function LegendLayer(props) {
  const style = { overflow: "visible" };

  return <svg id="legendGroup" x={0} y={props.y} style={style} />;
}

export default LegendLayer;
