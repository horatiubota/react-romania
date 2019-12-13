import React from "react"
import classnames from "classnames"

function PointLayer(props) {
  const style = { pointerEvents: "none", overflow: "visible" }

  return (
    <g className={"pointsGroup"}>
      {props.data.map((d, i) => {
        const path = props.projector(d)
        const [x, y] = props.projector.centroid(d)

        return (
          <g id={`${d.properties.id}`} key={i} className={"pointCircleGroup"}>
            {props.showPointLabels && (
              <foreignObject x={x} y={y} width={1} height={1} style={style}>
                <div
                  id={`${d.properties.id}`}
                  className={classnames(props.id, props.classes.pointLabel)}
                >
                  <span>{d.properties.defaultLabel}</span>
                </div>
              </foreignObject>
            )}
            <path
              d={path}
              id={`${d.properties.id}`}
              className={classnames("pointCircle", props.classes.point)}
            />
          </g>
        )
      })}
    </g>
  )
}

PointLayer.defaultProps = {
  defaultCircleFill: "red",
  defaultCircleRadius: 2,
  defaultCircleStroke: "black",
}

export default PointLayer
