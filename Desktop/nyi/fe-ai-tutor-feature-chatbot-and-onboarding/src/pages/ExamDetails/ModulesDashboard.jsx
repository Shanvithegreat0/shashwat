/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Paper, Tooltip, Link, Stack, Divider } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TopicIcon from '@mui/icons-material/Topic';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenPrompt from './FullscreenPrompt';

const ModulesDashboard = ({ moduleData, examId, userRecord, moduleRecord }) => {
    const navigate = useNavigate();
    const [recordType, setRecordType] = useState();
    const [record, setRecord] = useState({
        module: {
            averageScore: 0,
            attempts: 0,
            totalScore: 0,
            highestScore: 0,
            performanceStatus: ''
        },
        subject: []
    });
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
    const [quizPath, setQuizPath] = useState('');

    const getPerformanceStatus = (score) => {
        if (!score && score !== 0) return { status: '--', color: 'text.secondary' };
        if (score <= 20) return { status: 'Needs Improvement', color: '#d32f2f' }; // red
        if (score <= 50) return { status: 'Below Average', color: '#ed6c02' }; // orange
        if (score <= 60) return { status: 'Average', color: '#2196f3' }; // blue
        if (score <= 85) return { status: 'Good', color: '#2e7d32' }; // green
        return { status: 'Excellent', color: '#9c27b0' }; // purple
    };

    const processRecords = (records) => {
        console.log(records, 'user records');
        let moduleStats = {
            averageScore: 0,
            attempts: 0,
            totalScore: 0,
            highestScore: 0,
            performanceStatus: ''
        };

        let subjects = [];

        records.forEach(record => {
            if (!record.subject) {
                // Process as module stats
                const averageScore = record.averageScore?.toFixed(2) || 0;
                const performanceData = getPerformanceStatus(Number(averageScore));
                moduleStats = {
                    averageScore: averageScore,
                    attempts: record.attempt || 0,
                    totalScore: record.totalScore || 0,
                    totalMarks: record.totalMarks || 0,
                    highestScore: record.highestScore || 0,
                    performanceStatus: performanceData.status,
                    statusColor: performanceData.color
                };
            } else {
                // Process as subject stats
                const averageScore = record.averageScore?.toFixed(2) || 0;
                const performanceData = getPerformanceStatus(Number(averageScore));
                subjects.push({
                    id: record.subject.id,
                    name: record.subject.name,
                    averageScore: averageScore,
                    attempts: record.attempt || 0,
                    totalScore: record.totalScore || 0,
                    totalMarks: record.totalMarks || 0,
                    highestScore: record.highestScore || 0,
                    performanceStatus: performanceData.status,
                    statusColor: performanceData.color
                });
            }
        });

        return { module: moduleStats, subject: subjects };
    };

    useEffect(() => {
        if (userRecord) setRecord(processRecords(userRecord));
    }, [userRecord]);

    const statCards = [
        { 
            icon: <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
            value: moduleRecord?.averageScore?.toFixed(2) || '--', 
            label: "Average Score",
            color: 'primary.main'
        },
        { 
            icon: <TimelineIcon sx={{ fontSize: 32, color: 'success.main' }} />,
            value: moduleRecord?.attempts || '--', 
            label: "Attempts",
            link: `/attempts/module/${moduleData.slug}`,
            color: 'success.main'
        },
        { 
            icon: <TrendingUpIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
            value: moduleRecord?.totalMarks || '--', 
            label: "Total Marks",
            color: 'warning.main'
        },
        { 
            icon: <EmojiEventsIcon sx={{ fontSize: 32, color: 'error.main' }} />,
            value: moduleRecord?.highestScore?.toFixed(2) || '--', 
            label: "Highest Score",
            color: 'error.main'
        }
    ];

    const subjects = [
        {
            bgGradient: 'linear-gradient(135deg, rgba(1,42,74,0.95) 0%, rgba(2,62,109,0.9) 100%)',
            textColor: '#ffffff',
            buttonColor: '#012a4a',
            hoverColor: '#023e8a',
            accentColor: '#4fc3f7'
        },
        {
            bgGradient: 'linear-gradient(135deg, rgba(1,42,74,0.95) 0%, rgba(2,62,109,0.9) 100%)',
            textColor: '#ffffff',
            buttonColor: '#012a4a',
            hoverColor: '#023e8a',
            accentColor: '#b39ddb'
        },
        {
            bgGradient: 'linear-gradient(135deg, rgba(1,42,74,0.95) 0%, rgba(2,62,109,0.9) 100%)',
            textColor: '#ffffff',
            buttonColor: '#012a4a',
            hoverColor: '#023e8a',
            accentColor: '#80cbc4'
        }
    ];

    const handleStartQuiz = (e, path) => {
        e.preventDefault();
        setQuizPath(path);
        setShowFullscreenPrompt(true);
    };

    const handleEnterFullscreen = async () => {
        try {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
            // Navigate to quiz after entering fullscreen
            navigate(quizPath);
        } catch (error) {
            console.error('Error entering fullscreen:', error);
            // Navigate anyway if fullscreen fails
            navigate(quizPath);
        }
    };

    const handleContinueWithoutFullscreen = () => {
        setShowFullscreenPrompt(false);
        navigate(quizPath);
    };

    return (
        <Box sx={{ 
            width: '100%', 
            mt: '-24px' // Negative margin to remove the gap
        }}>
            <Typography 
                variant="h2" 
                sx={{ 
                    color: '#012a4a',
                    fontWeight: 800,
                    py: 1,
                    px: 3,
                    fontFamily: '"Poppins", "Roboto", sans-serif',
                    fontSize: '2rem',
                    borderBottom: '1px solid rgba(1,42,74,0.1)',
                    background: '#fff'
                }}
            >
                JEE
            </Typography>
            <Paper elevation={5} sx={{ 
                borderRadius: { xs: 0, sm: 4 }, 
                overflow: 'hidden',
                background: '#f8f9fa',
                boxShadow: '0 8px 32px rgba(1,42,74,0.1)'
            }}>
                {/* Header */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #012a4a 0%, #013a63 100%)',
                    color: "white",
                    p: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 20px rgba(1,42,74,0.2)'
                }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ 
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '0.5px'
                    }}>
                        {moduleData.name}
                    </Typography>
                    <Button
                        onClick={(e) => handleStartQuiz(e, `/quiz/exam/${examId}/module/${moduleData.slug}`)}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            bgcolor: '#ffffff !important',
                            color: '#012a4a',
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#ffffff !important',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
                            }
                        }}
                    >
                        Start Mock Test
                    </Button>
                </Box>

                {/* Fullscreen Prompt */}
                <FullscreenPrompt 
                    open={showFullscreenPrompt}
                    onClose={handleContinueWithoutFullscreen}
                    onProceed={handleEnterFullscreen}
                />

                {/* Stats Cards */}
                <Box sx={{ p: 4, bgcolor: '#f8f9fa' }}>
                    <Grid container spacing={3}>
                        {statCards.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card 
                                    component={stat.link ? RouterLink : 'div'} 
                                    to={stat.link} 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3,
                                        border: '1px solid',
                                        borderColor: 'rgba(1,42,74,0.1)',
                                        borderRadius: 3,
                                        background: 'white',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 2,
                                        height: '100%',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(1,42,74,0.12)',
                                            borderColor: 'rgba(1,42,74,0.2)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: `${stat.color}15`
                                    }}>
                                        {React.cloneElement(stat.icon, { 
                                            sx: { 
                                                fontSize: 24,
                                                color: stat.color
                                            } 
                                        })}
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ 
                                            color: '#012a4a', 
                                            fontWeight: 'bold',
                                            fontSize: '1.75rem',
                                            lineHeight: 1.2,
                                            mb: 0.5
                                        }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: 'rgba(1,42,74,0.7)',
                                            fontSize: '0.875rem'
                                        }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Divider sx={{ opacity: 0.1 }} />

                {/* Subject Cards */}
                <Box sx={{ p: 4, background: '#f8f9fa' }}>
                    <Grid container spacing={4}>
                {moduleData.subjects.map((subject, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card 
                                    elevation={0}
                            sx={{
                                height: '100%',
                                        borderRadius: 4,
                                background: 'white',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(1,42,74,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 32px rgba(1,42,74,0.15)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                {/* Subject Header */}
                                <Box sx={{
                                    p: 3,
                                    background: subjects[index]?.bgGradient,
                                            borderTopLeftRadius: 16,
                                            borderTopRightRadius: 16
                                }}>
                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        color={subjects[index]?.textColor}
                                                sx={{ 
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                                    letterSpacing: '0.5px'
                                                }}
                                    >
                                        {subject.name}
                                    </Typography>
                                </Box>

                                {/* Subject Content */}
                                        <Box sx={{ p: 3 }}>
                                    {(() => {
                                        const subjectRecord = record.subject.find((rec) => rec.id === subject._id);
                                        return (
                                                    <Stack spacing={3}>
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between', 
                                                            alignItems: 'center',
                                                            p: 2,
                                                            bgcolor: 'rgba(1,42,74,0.03)',
                                                            borderRadius: 2
                                                        }}>
                                                            <Typography sx={{ 
                                                                fontWeight: '600',
                                                                color: '#012a4a'
                                                            }} variant="body2">
                                                                Performance Status
                                                            </Typography>
                                                            <Typography 
                                                                variant="body2" 
                                                                fontWeight="bold" 
                                                                sx={{ 
                                                                    color: subjectRecord ? subjectRecord.statusColor : 'text.secondary',
                                                                    px: 2,
                                                                    py: 0.5,
                                                                    bgcolor: 'rgba(1,42,74,0.05)',
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                        {subjectRecord ? subjectRecord.performanceStatus : '--'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <Grid container spacing={2} alignItems="center">
                                                    {[
                                                        { label: 'Average Score', value: subjectRecord?.averageScore },
                                                        { label: 'Attempts', value: subjectRecord?.attempts, link: true },
                                                        { label: 'Total Marks', value: subjectRecord?.totalMarks },
                                                        { label: 'Highest Score', value: subjectRecord?.highestScore }
                                                    ].map((item, idx) => (
                                                        <Grid item xs={6} key={idx}>
                                                            <Box sx={{
                                                                            p: 2,
                                                                            bgcolor: 'rgba(1,42,74,0.02)',
                                                                            borderRadius: 3,
                                                                textAlign: 'center',
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                            justifyContent: 'center',
                                                                            transition: 'all 0.3s ease',
                                                                            '&:hover': {
                                                                                bgcolor: 'rgba(1,42,74,0.04)'
                                                                            }
                                                            }}>
                                                                {item.link ? (
                                                                                <Box component={RouterLink} to={`/attempts/subject/${subject.slug}`} sx={{ 
                                                                                    textDecoration: 'none', 
                                                                                    color: 'inherit'
                                                                                }}>
                                                                                    <Typography variant="h5" fontWeight="bold" color="#012a4a">
                                                                            {item.value || '--'}
                                                                        </Typography>
                                                                                    <Typography variant="body2" sx={{ color: 'rgba(1,42,74,0.7)' }}>
                                                                            {item.label}
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <>
                                                                                    <Typography variant="h5" fontWeight="bold" color="#012a4a">
                                                                            {item.value || '--'}
                                                                        </Typography>
                                                                                    <Typography variant="body2" sx={{ color: 'rgba(1,42,74,0.7)' }}>
                                                                            {item.label}
                                                                        </Typography>
                                                                    </>
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                </Box>
                                                
                                                <Button
                                                    onClick={(e) => handleStartQuiz(e, `/quiz/exam/${examId}/subject/${moduleData.slug}/${subject.slug}`)}
                                                    variant="contained"
                                                    startIcon={<PlayArrowIcon />}
                                                    fullWidth
                                                    sx={{
                                                                bgcolor: '#012a4a !important',
                                                                color: 'white',
                                                        py: 1.5,
                                                                mt: 2,
                                                                borderRadius: 3,
                                                                fontWeight: 600,
                                                                letterSpacing: '0.5px',
                                                                boxShadow: '0 4px 15px rgba(1,42,74,0.2)',
                                                        '&:hover': {
                                                                    bgcolor: '#013a63 !important',
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow: '0 6px 20px rgba(1,42,74,0.3)'
                                                        },
                                                                transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    Start Subject Quiz
                                                </Button>
                                            </Stack>
                                        );
                                    })()}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default ModulesDashboard;