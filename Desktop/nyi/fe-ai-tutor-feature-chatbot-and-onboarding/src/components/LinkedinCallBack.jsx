import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from './Toasts/useToast';
import { useAuthenticateLinkedinMutation } from '../store/slices/apiServices';
import { useLocation, useNavigate } from 'react-router';
import { loginSuccess } from '../store/slices/auth';

const LinkedInCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {showToast}=useToast();
    const userId = useSelector(state => state.auth.user.id);
    const [triggerLinkedingAuth]=useAuthenticateLinkedinMutation()


    const handleLinkedin=async({code,id})=>{
        try {
            const {data,message}=await triggerLinkedingAuth({code,id}).unwrap()
            console.log("handleLinkedin",data.user)
            dispatch(loginSuccess(data))
            showToast({message:message,type:"success"});
        } catch (error) {
            showToast({message:error.data.message.join(', '),severity:'error'})
        }finally{
            navigate('/social')
        }
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const authCode = queryParams.get('code');

        if (authCode) {
            handleLinkedin({ code: authCode, id: userId })
        }
    }, [location]);

    return <p>Redirecting...</p>; 
};

export default LinkedInCallback;
