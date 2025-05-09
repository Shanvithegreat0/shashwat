import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import OTPInput from 'react-otp-input';
import { useResendVerifyUserOTPMutation, useVerifyUserOTPMutation } from '../../store/slices/apiServices';
import { loginSuccess } from '../../store/slices/auth';

import { useToast } from '../../components/Toasts/useToast';

const VerifyUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user)
  const [triggerVerifyOtp, { isLoading }] = useVerifyUserOTPMutation()
  const [triggerResend, { isLoading: isResendLoading }] = useResendVerifyUserOTPMutation()
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60)
  const [resendDisabled, setResendDisabled] = useState(false);


  const { showToast } = useToast()

  useEffect(() => {
    if (otpSent && countdown <= 0) {
      setOtpSent(false);
      setResendDisabled(false)
    }
    if (otpSent) {
      const intervalId = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [otpSent, countdown]);

  function formatTime(timeLeft) {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const handleResendOtp = async () => {

    try {
      const { data, message } = await triggerResend().unwrap()
      showToast({ message, type: "success" })
      setOtpSent(true);
      setCountdown(60);
      // dispatch(loginSuccess(data))
    } catch (error) {
      showToast({ message: error.data.message, type: "error" })
    } finally {
      setResendDisabled(true);
    }

  };

  const formik = useFormik({
    initialValues: {
      emailOtp: '',
    },
    validationSchema: Yup.object({
      emailOtp: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const { data, message } = await triggerVerifyOtp({
          email: user.email,
          emailOtp: Number(values.emailOtp)
        }).unwrap()
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
        <Card variant='outlined' sx={{ width: '100%' }}>
          <CardMedia sx={{ objectFit: "contain", mt: 2 }} height={80} component={'img'} src='/assets/icons/full_logo.png'></CardMedia>
          <CardHeader
            sx={{ textAlign: 'center' }}
            title={`Welcome ${user.name}`}
          />
          <CardHeader
            sx={{ textAlign: 'center' }}
            title='Verify OTP'
            subheader='Please Enter the OTP'
          />
          <Divider />
          <CardContent sx={{ p: 3 }}>
            <OTPInput
              value={formik.values.emailOtp}
              onChange={(newVal) => {
                formik.handleChange({ target: { name: 'emailOtp', value: newVal } })
              }}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input  {...props} />}
              inputStyle={{ width: "40px", height: "40px" }}
            />

          </CardContent>

          <Divider />
          <CardActions sx={{ px: 3, pt: 3 }}>
            <Button loading={isLoading} type="submit" fullWidth variant='contained'>Verify Otp</Button>
          </CardActions>
          <CardActions sx={{ px: 3, pb: 3 }} >
            <Button loading={isResendLoading} fullWidth variant='outlined' disabled={resendDisabled} onClick={handleResendOtp}>{resendDisabled ? `Resend in ${formatTime(countdown)}` : 'Resend'}</Button>
          </CardActions>
        </Card>
      </form>
    </div>
  )
}

export default VerifyUserForm