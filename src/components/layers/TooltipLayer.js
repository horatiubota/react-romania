import React from 'react'

function TooltipLayer(props) {
    const style = {pointerEvents: 'none', overflow: 'visible'}

    return (
      <g id='tooltipGroup'>
        <foreignObject id='tooltipObject' width={1} height={1} style={style}>
          <div id='tooltipDiv' className='tooltipDiv' />
        </foreignObject>
      </g> 
    )
}

export default TooltipLayer
