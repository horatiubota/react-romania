import React from "react"

function DefaultTooltip(props) {
  const style = { display: "inline-block", background: "white" }

  return (
    <div style={style}>
      <table>
        <tr>
          <td>{props.id}</td>
          <td>{props.value}</td>
        </tr>
      </table>
    </div>
  )
}

export default DefaultTooltip
