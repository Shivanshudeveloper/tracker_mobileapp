import { useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  Snackbar,
  Alert,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import ProfileSetting from '../components/settings/ProfileSetting'

const SettingsView = () => {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    setError(null)
    setSuccess(null)
  }

  return (
    <>
      <Helmet>
        <title>Settings | Material Kit</title>
      </Helmet>
      <Grid container>
        <Grid item xs={10}>
          <Box sx={{ p: 2 }}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Profile</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ProfileSetting
                  success={setSuccess}
                  error={setError}
                  open={setOpen}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel2a-content'
                id='panel2a-header'
              >
                <Typography>Security</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel3a-content'
                id='panel3a-header'
              >
                <Typography>Manage Mobile Devices</Typography>
              </AccordionSummary>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel3a-content'
                id='panel3a-header'
              >
                <Typography>Manage Hotspots</Typography>
              </AccordionSummary>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel3a-content'
                id='panel3a-header'
              >
                <Typography>Manage Groups</Typography>
              </AccordionSummary>
            </Accordion>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 2,
            }}
          >
            <Button variant='contained' sx={{ pt: 1, pb: 1, pl: 3, pr: 3 }}>
              Edit
            </Button>
            <Button
              variant='contained'
              sx={{ pt: 1, pb: 1, pl: 3, pr: 3, ml: 2 }}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>

      {success !== null && (
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          action={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity='success'
            sx={{ width: '100%' }}
          >
            {success}
          </Alert>
        </Snackbar>
      )}
      {error !== null && (
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          action={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default SettingsView
