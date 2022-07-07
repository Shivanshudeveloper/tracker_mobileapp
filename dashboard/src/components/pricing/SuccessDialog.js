import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Dialog, DialogContent, Box } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

const SuccessDialog = (props) => {
    const [progress, setProgress] = useState(0)
    const [intervalId, setIntervalId] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        if (props.open === false) {
            return
        }

        const interval = setInterval(() => {
            setProgress((progress) => progress + 5)
        }, 250)

        setIntervalId(interval)

        return () => clearInterval(interval)
    }, [props])

    useEffect(() => {
        if (progress > 100) {
            clearInterval(intervalId)
            navigate('/app/pricing', { replace: true })
        }
    }, [progress])

    console.log('Here')

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogContent>
                <Box>
                    <img
                        src='https://firebasestorage.googleapis.com/v0/b/evencloud-26d32.appspot.com/o/success.png?alt=media&token=14200909-edb3-4628-bfe5-36e346709737'
                        alt='Success Image'
                        style={{ width: '250px', height: '250px' }}
                    />

                    <LinearProgress
                        variant='determinate'
                        value={progress}
                        color='success'
                    />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(SuccessDialog)
