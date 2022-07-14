import React from 'react'
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from '@mui/material'

const MonthFilter = (props) => {
  const [isDisable, setIsDisable] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (props.subscription !== null) {
      setIsDisable(props.subscription.reportCount === 1)
    }
  }, [props.subscription])

  const showError = () => {
    setOpen(true)
  }

  console.log(isDisable)

  return (
    <React.Fragment>
      <FormControl variant="outlined" sx={{ width: '250px', ml: 3 }}>
        <InputLabel>Month</InputLabel>
        <Select
          value={props.selectedMonth}
          onChange={
            isDisable
              ? () => showError()
              : (e) => props.setSelectedMonth(e.target.value)
          }
          label="Month"
        >
          {props.Months.map((month, i) => (
            <MenuItem sx={{ py: 1.2, px: 2 }} key={i} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          You cannot use this feature. Please upgrade your plan.
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}

export default React.memo(MonthFilter)
