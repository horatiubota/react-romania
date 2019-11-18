import React from 'react'
import classnames from 'classnames'
import idnames from '../../utils/idnames'

function TooltipLayer(props) {
    const style = {pointerEvents: 'none', overflow: 'visible'}

    return <g id={'tooltipGroup'}>
    <foreignObject id={'tooltipObject'} width={1} height={1} style={style}>
      <div id={'tooltipDiv'} className={'tooltipDiv'}></div>
    </foreignObject>
  </g> 
}

export default TooltipLayer
