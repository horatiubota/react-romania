import React from 'react'
import classnames from 'classnames'
import idnames from '../../utils/idnames'

function PointLayer(props) {

    const style = {pointerEvents: 'none', overflow: 'visible'}

    return <g id={idnames(props.id, 'pointsGroup')}
        className={classnames(props.id, 'pointsGroup')}>
    {   
        props.data.map((d,i) => {
            const [x, y] = props.projector.centroid(d.geometry)
            return (
            <g 
                id={idnames(props.id, d.properties.id, 'pointCircleGroup')} 
                key={i}
                className={classnames(props.id, 'pointCircleGroup')}>    
                <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y}
                    id={idnames(props.id, d.properties.id, 'pointCircle')}
                    className={classnames(props.id, 'pointCircle', props.classes.point)} />
                <foreignObject x={x} y={y} width={1} height={1} style={style}>
                    <div id={idnames(props.id, d.properties.id, 'pointLabel')} 
                        className={classnames(props.id, props.classes.pointLabel)}>
                       <span>{d.properties.defaultLabel}</span>
                    </div>
                </foreignObject>
            </g>);
        })
    } 
    </g>       
}

PointLayer.defaultProps = { 
    defaultCircleFill: 'red',
    defaultCircleRadius: 2,
    defaultCircleStroke: 'black'
}

export default PointLayer
