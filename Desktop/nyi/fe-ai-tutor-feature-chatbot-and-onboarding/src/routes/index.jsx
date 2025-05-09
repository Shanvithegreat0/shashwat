import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/login';
import Home from '../pages/home/Home';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import ForgotPassword from '../pages/login/ForgotPassword';
import ResetPassword from '../pages/login/ResetPassword';
import Register from '../pages/Register';
import VerifyUserForm from '../pages/VerifyUser/VerifyUserForm';
import VerifyInviteCode from '../pages/VerifyInviteCode';
import VerifyOtp from '../pages/verifyOtp'
import ExamDetails from '../pages/ExamDetails';
import QuizPage from '../pages/Quiz';
import Details from '../pages/Details/Details';
import Attempts from '../pages/Attempts';
import GettingStarted from '../pages/Dashboard/GettingStarted';
import OnboardingGuard from './OnboardingGuard';
import LandingPage from '../pages/landing';
import PublicLayout from '../layouts/PublicLayout';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/profile';
import ChatbotManager from '../components/ChatbotManager';
import ChatPage from '../pages/ChatPage';

// Import additional pages for the landing site
import FeaturesPage from '../pages/landing/Features';
import PricingPage from '../pages/landing/Pricing';
import AboutPage from '../pages/landing/About';
import ContactPage from '../pages/landing/Contact';

const PublicRoutes = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    console.log(`PublicRoutes: ${location.pathname} isAuthenticated = ${isAuthenticated}`);
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const PrivateRoutes = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const VerifiedRoutes = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!user.verified) {
        return <Navigate to="/verify-user" />;
    }
    return children;
};

const NotVerifiedRoutes = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    console.log(`NotVerifiedRoute: ${location.pathname} verified = ${user.verified}`);

    if (user.verified) {
        console.warn('Redirecting to /posts because user is already verified.');
        return <Navigate to="/exams" />;
    }
    return children;
};

const ActivatedRoutes = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    console.log(`ActivatedRoutes: ${location.pathname} activated = ${user.usedInviteCode}`);

    if (location.pathname=== '/exams') {
        console.warn('Redirecting to /verify-invite because invite code is not used.');
        return <Navigate to="/exams/JEE" />;
    }
    return children;
};

const NotActivatedRoutes = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    console.log(`NotActivatedRoutes: ${location.pathname} activated = ${user.usedInviteCode}`);

    if (user.usedInviteCode) {
        console.warn('Redirecting to /posts because invite code is already used.');
        return <Navigate to="/exams" />;
    }
    return children;
};

const PrivateLayout = () => {
    return <Outlet />
}

const VerifiedLayout = ({ children }) => {
    return <Outlet />
}

// Root layout to include the ChatbotManager alongside all routes
const RootLayout = () => {
    return (
        <>
            <Outlet />
            <ChatbotManager />
        </>
    );
};

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<RootLayout />}>
            {/* Public Routes - Landing Pages */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Route>
            
            {/* Public Routes for Unauthenticated Users */}
            <Route element={<PublicRoutes><AuthLayout /></PublicRoutes>}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forget-password" element={<Navigate to="/forgot-password" replace />} />
                <Route path='/verify-otp/:email' element={<VerifyOtp/>}/>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Private Routes for Authenticated Users */}
            <Route element={<PrivateRoutes><PrivateLayout /></PrivateRoutes>}>
                {/* If User is NOT Verified */}
                <Route element={<NotVerifiedRoutes><AuthLayout /></NotVerifiedRoutes>}>
                    <Route path='/verify-user' element={<VerifyUserForm />} />
                </Route>
                {/* If User is Verified */}
                <Route element={<VerifiedRoutes><VerifiedLayout /></VerifiedRoutes>}>

                    {/* If User has NOT used Invite Code */}
                    <Route element={<NotActivatedRoutes ><AuthLayout /></NotActivatedRoutes>}>
                        <Route path='/verify-invite' element={<VerifyInviteCode />} />
                    </Route>

                    {/* If User has used Invite Code */}
                    <Route element={<ActivatedRoutes><MainLayout /></ActivatedRoutes>}>
                        {/* Redirect legacy onboarding routes to Getting Started */}
                        <Route path='/welcome' element={<Navigate to="/getting-started" replace />} />
                        <Route path='/onboarding' element={<Navigate to="/getting-started" replace />} />
                        <Route path='/getting-started' element={<GettingStarted />} />
                        
                        {/* Protected Routes that require Onboarding */}
                        <Route element={<OnboardingGuard exclude={['/getting-started']} />}>
                            <Route path="/dashboard" element={<Dashboard/> } />
                            <Route path="/exams" element={<Home/> } />
                            <Route path="/profile" element={<Profile/> } />
                            <Route path="/exams/:id" element={<ExamDetails/> } />
                            <Route path="/quiz" element={<QuizPage/> } />
                            <Route path="/quiz/exam/:examId/:type/:moduleId/:subjectId/:topicId" element={<QuizPage/>} />
                            <Route path="/quiz/exam/:examId/:type/:moduleId/:subjectId" element={<QuizPage/>} />
                            <Route path="/quiz/exam/:examId/:type/:moduleId" element={<QuizPage/>} />
                            <Route path="/quiz/result/:assessmentId" element={<Details /> } />
                            <Route path="/attempts/:entityType/:entityId" element={<Attempts /> } />
                            <Route path="/attempts/all" element={<Attempts /> } />
                        </Route>
                        
                        <Route path="*" element={<Navigate to="/getting-started" />} />
                    </Route>

                </Route>
            </Route>

            {/* Chat Route */}
            <Route path="/chat" element={<ChatPage />} />
        </Route>
    )
);

export default routes;
