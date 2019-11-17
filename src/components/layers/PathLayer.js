import React from 'react'
import classnames from 'classnames'
import idnames from '../../utils/idnames'

function PathLayer(props) {

    return <g id={idnames(props.id, 'polygonsGroup')} 
        className={classnames(props.id, 'polygonsGroup')}>
    { 
    props.data.map((d,i) => (
        <g 
            id={idnames(props.id, d.properties.id, 'polygonPathGroup')} 
            key={i}
            className={classnames(props.id, 'polygonPathGroup')}>    
            <path
                d={props.projector(d.geometry)}
                id={idnames(props.id, d.properties.id, 'polygonPath')}
                style={{fill: d.properties.color || props.defaultPolygonFill}}
                className={classnames(props.id, props.polygonClass, 'polygonPath')} />
        </g> ))
    }
    </g>
}

PathLayer.defaultProps = { 
    defaultPolygonFill: 'lightgray',
}

export default PathLayer
