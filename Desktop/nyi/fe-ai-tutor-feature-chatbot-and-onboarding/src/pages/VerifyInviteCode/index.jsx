import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React from 'react'
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import { useLazyVerifyInviteCodeQuery, } from '../../store/slices/apiServices';
import { loginSuccess } from '../../store/slices/auth';
import { useToast } from '../../components/Toasts/useToast';

const VerifyInviteCode = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [triggerVerifyInvite, { isLoading }] = useLazyVerifyInviteCodeQuery()

    const { showToast } = useToast()
    const formik = useFormik({
        initialValues: {
            inviteCode: '',
        },
        validationSchema: Yup.object({
            inviteCode: Yup.string().required('Invite code is Required'),
        }),
        onSubmit: async (values) => {
            try {
                const { data, message } = await triggerVerifyInvite({ inviteCode: values.inviteCode }).unwrap()
                showToast({ message, type: "success" })
                dispatch(loginSuccess(data))
            } catch (error) {
                showToast({ message: error.data.message, type: "error" })
            }
        },
    });


    return (
        <div>
            <form noValidate onSubmit={formik.handleSubmit}>
                <Card variant='outlined' sx={{ minWidth: 300 }}>
                    <CardMedia sx={{ objectFit: "contain", mt: 2 }} height={80} component={'img'} src='/assets/icons/full_logo.png'></CardMedia>
                    <CardHeader
                        sx={{ textAlign: 'center' }}
                        title='Verify Invite'
                        subheader='Please enter your Invite Code'
                    />
                    <Divider />
                    <CardContent sx={{ p: 3 }}>
                        <TextField size='small' sx={{ minWidth: 300 }}
                            required
                            margin='normal'
                            label="Invite Code"
                            variant="outlined"
                            fullWidth
                            name="inviteCode"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.inviteCode}
                            error={formik.touched.inviteCode && Boolean(formik.errors.inviteCode)}
                            helperText={formik.touched.inviteCode && formik.errors.inviteCode}
                        />

                    </CardContent>
                    <Divider />
                    <CardActions sx={{ p: 3 }}>
                        <Button loading={isLoading} type="submit" fullWidth variant='contained'>Submit</Button>
                    </CardActions>
                </Card>
            </form>
        </div>
    )
}

export default VerifyInviteCode