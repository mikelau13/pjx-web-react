import React, { FunctionComponent, useState, useEffect } from 'react';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid"; 
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import AuthService from '../../services/authService';
import CalendarService from '../../services/calendarService';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    timeField: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        width: '50%'
    }
  });

type EventProps = {
    id?: string,
    title: string,
    start: string,
    end?: string,
    slotDuration?: string,
    allDay?: boolean
};

type DialogProps = {
    title: string,
    start?: string,
    startTime?: string,
    end?: string,
    allDay: boolean
}

const Calendar: FunctionComponent<WithStyles<typeof styles>> = (props) => {
    const authService = new AuthService();
    const calendarService = new CalendarService(authService);

    const { classes } = props;

    const [events, setEvents] = useState<EventProps[]>([]);
    const [open, setOpenDialog] = useState(false);
    const [dialogValues, setDialogValues] = useState<DialogProps>({ title: '', startTime: '00:00', allDay: true });  

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        console.log('TODO: mocking data here, need to write codes here to load data from api');
        const result = [
            { id: '1', title: 'event 1', start: '2020-08-10 13:00:00', end: '2020-08-13 05:00:00' },
            { id: '2', title: 'event 2', start: '2020-08-15' }
        ];
        setEvents(result);
    }, []); 

    const handleDateClick = (arg: DateClickArg) => {
        setDialogValues(prevState => ({...prevState, start: arg.date.toISOString().substring(0, 10) }));
        handleOpenDialog();
    };

    const handleChange = (e:any) => {
        const { id, value } = e.target;

        setDialogValues(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleAllDayChange = () => {
        setDialogValues(prevState => ({...prevState, end: '', startTime: '00:00', allDay: !dialogValues.allDay }));
    }

    const enableEnd = () => {
        if (dialogValues.allDay) {
            handleAllDayChange();
        }
    }

    const handleAddClick = () => {
        if (dialogValues.title.length && dialogValues.start) {
            var saveObj: EventProps = {
                title: dialogValues.title, 
                start: `${dialogValues.start}T${dialogValues.startTime}`,
                end: dialogValues.end,
                allDay: dialogValues.allDay
            };

            if (dialogValues.allDay){
                saveObj.end = undefined;
            }

            console.log('Submitting api and getting promise');
            console.log(saveObj);
            calendarService.eventCreate(saveObj)
                .then(result => {
                    console.log('calendarService.eventCreate(saveObj)');
                    console.log(result);
                    setEvents([
                        ...events,
                        saveObj
                    ]);
                    
                    handleCloseDialog();
                }).catch(error => {
                    console.log('calendarService.eventCreate(saveObj)');
                    console.log(`error: ${error}`);
                });
                
            console.log('line after calendarService.eventCreate(saveObj)');
        }
    }

    const handleEventClick = (arg:EventClickArg) => {
        console.log(arg);
        setDialogValues(prevState => ({...prevState
            , title: arg.event.title
            , end: ''
            , start: arg.event.start?.toISOString().substring(0, 10)
            , startTime: ''
            , allDay: arg.event.allDay 
        }));
        handleOpenDialog();
    }

    return (
        <>
            <FullCalendar
                themeSystem={'standard'}
                initialView={'dayGridMonth'}
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                events={events}
                headerToolbar={{  
                    left: "prev,next",  
                    center: "title",  
                    right: "dayGridMonth,timeGridWeek,timeGridDay"  
                }}
            />
            <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Calendar Events</DialogTitle>
                <DialogContent>
                    <DialogContentText>Add Event</DialogContentText>
                    <TextField
                        autoFocus
                        margin="normal"
                        className={classes.textField}
                        id="title"
                        label="Title"
                        type="string"
                        placeholder="enter title"
                        defaultValue={dialogValues.title}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="standard"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                id="allDay"
                                checked={dialogValues.allDay}
                                onChange={handleAllDayChange}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                        label="All day event"
                    />
                    <div>
                        <TextField
                            margin="normal"
                            className={classes.timeField}
                            id="start"
                            label="Start"
                            type='date' // or datetime-local
                            defaultValue={dialogValues.start}
                            onChange={handleChange}
                            required
                            variant="standard"
                        />
                        <TextField
                            margin="normal"
                            className={classes.timeField}
                            id="startTime"
                            label="Time"
                            type="time"
                            value={dialogValues.startTime}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="standard"
                            disabled={dialogValues.allDay}
                        />
                    </div>
                    <TextField
                        margin="normal"
                        className={classes.textField}
                        id="end"
                        label="End"
                        type="datetime-local"
                        defaultValue={dialogValues.end}
                        onChange={handleChange}
                        onClick={enableEnd}
                        fullWidth
                        variant="standard"
                        disabled={dialogValues.allDay}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                    <Button onClick={handleAddClick} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default withStyles(styles)(Calendar);
