import React from 'react'
import classnames from 'classnames'
import idnames from '../../utils/idnames'

function LabelLayer(props) {

    return <g id={idnames(props.id, 'labelsGroup')}
      className={classnames(props.id, 'labelsGroup')}>
    { 
      props.data.map((d,i) => (
        <text
          id={idnames(props.id, 'text')}
          key={i}
          x={props.projector.centroid(d.geometry)[0] * 0.99} 
          y={props.projector.centroid(d.geometry)[1] * 1.01}>
          <tspan id={idnames(props.id, 'tspan')}
            className={classnames(props.id, props.classes.label)}>
            {
              props.showDefaultLabels ? 
                d.properties.defaultLabel : d.properties.label 
            }
          </tspan>
        </text>))
    }
    </g>
}

export default LabelLayer
