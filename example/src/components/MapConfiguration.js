import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { 
    interpolateReds,
    interpolateBlues,
    interpolateBrBG,
    interpolatePRGn,
    interpolateCividis
} from 'd3';

const colors = {
    Reds: {label: 'Reds', interpolator: interpolateReds},
    Blues: {label: 'Blues', interpolator: interpolateBlues},
    BrBG: {label: 'BrBG', interpolator: interpolateBrBG},
    PrGN: {label: 'PrGN', interpolator: interpolatePRGn},
    Cividis: {label: 'Cividis', interpolator: interpolateCividis},
}

export default function MapConfiguration (props) {

    const [color, setColor] = useState(colors.Reds.label)
    const handleColorChange = (event) => {
        setColor(event.target.value);
        props.handleColorChange(colors[event.target.value].interpolator);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
            <FormGroup>
            <FormControl>
                <InputLabel id="demo-simple-select-label">Color scheme</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    onChange={handleColorChange}
                    value={color}
                >
                <MenuItem value={colors.Reds.label}>Reds</MenuItem>
                <MenuItem value={colors.Blues.label}>Blues</MenuItem>
                <MenuItem value={colors.BrBG.label}>BrBG</MenuItem>
                <MenuItem value={colors.PrGN.label}>PrGN</MenuItem>
                <MenuItem value={colors.Cividis.label}>Cividis</MenuItem>
                </Select>
            </FormControl>
            <Box m={1}/>
            <FormControl>
                <FormControlLabel
                    control={<Checkbox checked={props.secondaryPaths} onChange={props.handleCheckboxChange('secondaryPaths')} />}
                    label="secondaryPaths"
                />
            </FormControl>
            <FormControl>
                <FormControlLabel
                    control={<Checkbox checked={props.showLabels} onChange={props.handleCheckboxChange('showLabels')} value={props.showLabels} />}
                    label="showLabels"
                />
            </FormControl>
            <FormControl>
                <TextField
                    disabled={!props.showLabels}
                    id="outlined-basic"
                    label="Labels"
                    margin="normal"
                    variant="outlined"
                    value={props.labels}
                    onChange={props.handleInputChange('labels')}
                />
            </FormControl>
            </FormGroup>
            </Grid>
            <Box m={1}/>
            <Grid item xs={12}>
            <FormGroup>
            <FormControl>
                <FormControlLabel
                    control={<Checkbox checked={props.showPoints} onChange={props.handleCheckboxChange('showPoints')} value={true} />}
                    label="showPoints"
                />
            </FormControl>
            <FormControl>
                <TextField
                    disabled={!props.showPoints}
                    id="outlined-basic"
                    label="Point Names"
                    margin="normal"
                    variant="outlined"
                    value={props.pointNames}
                    onChange={props.handleInputChange('pointNames')}
                />
            </FormControl>
            <FormControl>
                <TextField
                    disabled={!props.showPoints}
                    id="outlined-basic"
                    label="Point Types"
                    margin="normal"
                    variant="outlined"
                    value={props.pointTypes}
                    onChange={props.handleInputChange('pointTypes')}
                />
            </FormControl>
            </FormGroup>
            </Grid>
            <Box m={2}/>
            <Grid container justify="space-between" alignItems="center">
                <Grid item xs style={{marginRight: 10}}>
                    <TextField
                        fullWidth
                        id="filled-number"
                        label="MinWidth"
                        type="number"
                        variant="outlined"
                        value={props.minWidth}
                        onChange={props.handleInputChange('minWidth')}
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
                        onChange={props.handleInputChange('minHeight')}
                    />
                </Grid>
            </Grid>
        </Grid>
        );
}
