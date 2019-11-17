import React from 'react'
import classnames from 'classnames'
import idnames from '../../utils/idnames'

function TooltipLayer(props) {
    const style = {pointerEvents: 'none', overflow: 'visible'}

    return <g id={idnames(props.id, 'tooltipGroup')}>
    <foreignObject id={idnames(props.id, 'tooltipObject')}
        width={1} height={1} style={style}>
      <div id={idnames(props.id, 'tooltipDiv')}
        className={classnames(props.id, 'tooltipDiv')}></div>
    </foreignObject>
  </g> 
}

export default TooltipLayer
