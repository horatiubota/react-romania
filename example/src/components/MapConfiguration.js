import React from "react"

import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import FormControl from "@material-ui/core/FormControl"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import TextField from "@material-ui/core/TextField"
import Select from "@material-ui/core/Select"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"

import {
  scales,
  colors,
  countyIds,
  cities,
  cityTypes,
} from "../utils/mapConfigOptions"

const useStyles = makeStyles({
  formControl: {
    marginTop: "1em",
  },
})

export default function MapConfiguration(props) {
  const classes = useStyles()

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormGroup>
          <FormControl className={classes.formControl}>
            <InputLabel id="scale-select-label">Scale type</InputLabel>
            <Select
              labelId="scale-select-label"
              onChange={props.handleInputChange("scale")}
              value={props.scale}
            >
              {scales.map(item => (
                <MenuItem key={item.label} value={item}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="color-select-label">Color scheme</InputLabel>
            <Select
              labelId="color-select-label"
              onChange={props.handleInputChange("color")}
              value={props.color}
            >
              {colors.map(item => (
                <MenuItem key={item.label} value={item}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2} />
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showLabels}
                  onChange={props.handleCheckboxChange("showLabels")}
                  value={props.showLabels}
                />
              }
              label="showLabels"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="select-labels-label">Labels</InputLabel>
            <Select
              labelId="select-labels-label"
              id="select-labels"
              disabled={!props.showLabels}
              multiple
              value={props.labels}
              onChange={props.handleInputChange("labels")}
              input={<Input />}
              renderValue={value => (
                <span>
                  {value.length > 9
                    ? `${value.slice(0, 10).join(", ")}, ...`
                    : `${value}`}
                </span>
              )}
            >
              {countyIds.map(id => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.showPoints}
                  onChange={props.handleCheckboxChange("showPoints")}
                  value={true}
                />
              }
              label="showPoints"
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!props.showPoints}
                  checked={props.showPointLabels}
                  onChange={props.handleCheckboxChange("showPointLabels")}
                  value={true}
                />
              }
              label="showPointLabels"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="select-point-names-label">Point names</InputLabel>
            <Select
              labelId="select-point-names-label"
              id="select-point-names"
              disabled={!props.showPoints}
              multiple
              value={props.pointNames}
              onChange={props.handleInputChange("pointNames")}
              input={<Input />}
              renderValue={value => (
                <span>
                  {value.length > 3
                    ? `${value.slice(0, 4).join(", ")}, ...`
                    : `${value}`}
                </span>
              )}
            >
              {cities.map(name => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="select-point-types-label">Point types</InputLabel>
            <Select
              labelId="select-point-types-label"
              id="select-point-types"
              disabled={!props.showPoints}
              multiple
              value={props.pointTypes}
              onChange={props.handleInputChange("pointTypes")}
              input={<Input />}
              renderValue={value => (
                <span>
                  {value.length > 1 ? `${value[0]}, ...` : `${value}`}
                </span>
              )}
            >
              {cityTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>
      </Grid>
      <Box m={2} />
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs style={{ marginRight: 10 }}>
          <TextField
            fullWidth
            id="filled-number"
            label="MinWidth"
            type="number"
            variant="outlined"
            value={props.minWidth}
            onChange={props.handleInputChange("minWidth")}
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            id="filled-number"
            label="MinHeight"
            type="number"
            variant="outlined"
            value={props.minHeight}
            onChange={props.handleInputChange("minHeight")}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
