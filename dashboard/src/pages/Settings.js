import { useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Snackbar,
  Alert,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import ProfileSetting from '../components/settings/ProfileSetting'
import SecuritySeting from '../components/settings/SecuritySeting'
import HotspotSetting from '../components/settings/HotspotSetting'
import GroupSetting from '../components/settings/GroupSetting'
import DeviceSetting from '../components/settings/DeviceSetting'

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
            <Accordion sx={{ boxShadow: 5, p: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant='h4'>Profile Setting</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ProfileSetting
                  success={setSuccess}
                  error={setError}
                  open={setOpen}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ boxShadow: 5, p: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel2a-content'
                id='panel2a-header'
              >
                <Typography variant='h4'>Security</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SecuritySeting
                  success={setSuccess}
                  error={setError}
                  open={setOpen}
                />
              </AccordionDetails>
            </Accordion>

            {/* <Accordion sx={{ boxShadow: 5, p: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel3a-content'
                id='panel3a-header'
              >
                <Typography variant='h4'>Manage Mobile Devices</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DeviceSetting
                  success={setSuccess}
                  error={setError}
                  open={setOpen}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ boxShadow: 5, p: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel3a-content'
                id='panel3a-header'
              >
                <Typography variant='h4'>Manage Hotspots</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <HotspotSetting
                  success={setSuccess}
                  error={setError}
                  open={setOpen}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ boxShadow: 5, p: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel3a-content'
                id='panel3a-header'
              >
                <Typography variant='h4'>Manage Groups</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <GroupSetting
                  success={setSuccess}
                  error={setError}
                  open={setOpen}
                />
              </AccordionDetails>
            </Accordion> */}
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
