import React from 'react'
import classnames from 'classnames'

function PathLayer(props) {

    return <g id={props.layerId} className={'polygonsGroup'}>
    { 
    props.data.map((d,i) => (
        <g 
            id={d.properties.id} 
            key={i}
            className={'polygonPathGroup'}>    
            <path
                d={props.projector(d.geometry)}
                id={d.properties.id}
                style={{fill: props.defaultPolygonFill}}
                className={classnames(props.polygonClass, 'polygonPath')} />
        </g> ))
    }
    </g>
}

PathLayer.defaultProps = { 
    defaultPolygonFill: 'lightgray',
}

export default PathLayer
