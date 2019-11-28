import React from 'react'
import classnames from 'classnames'

function PathLayer(props) {

    return <g id={props.layerId} className={'polygonsGroup'}>
    { 
        props.data.map((d,i) => (
            <path
                key={i}
                d={props.projector(d.geometry)}
                id={d.properties.id}
                style={{fill: props.defaultPolygonFill}}
                className={classnames(props.polygonClass, 'polygonPath')} 
            />
        ))
    }
    </g>
}

PathLayer.defaultProps = { 
    defaultPolygonFill: 'lightgray',
}

export default PathLayer
