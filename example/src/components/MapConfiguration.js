import React from 'react'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

export default function MapConfiguration (props) {
    
    return (
        <Grid container>
            <Grid item xs={12}>
            <FormGroup>
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
