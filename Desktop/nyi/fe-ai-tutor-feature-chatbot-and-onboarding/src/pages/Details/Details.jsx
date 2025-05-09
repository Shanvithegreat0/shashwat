import { useEffect, useState } from "react";
import { useParams , useNavigate, useLocation} from "react-router-dom";
import { Box, Typography, Paper, CircularProgress, Grid, Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Collapse, Stack, Card, CardContent, Tabs, Tab, Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { getTotalTimeTaken } from "../../utils/helper";
import { useGetAssessmentDetailsMutation } from "../../store/slices/apiServices";
import React from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

import AIAnalysis from './AIAnalysis';
import QuestionsOverview from './QuestionsOverview';
import PDFDownloadButton from '../../components/PDFDownloadButton';

const Details = () => {
    const { assessmentId} = useParams();
    const [details, setDetails] = useState({ assessment: {}, evaluations: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);
    const [triggerAssessmentDetails] = useGetAssessmentDetailsMutation();
    const [selectedSubject, setSelectedSubject] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Add effect to handle back navigation
    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            navigate('/exams/JEE', { replace: true });
        };

        window.history.pushState(null, null, location.pathname);
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [navigate, location.pathname]);

    useEffect(() => {
        const getDetails = async () => {
            try {
                setIsLoading(true);
                    const { data } = await triggerAssessmentDetails(assessmentId);
                    localStorage.removeItem(`assessment_${assessmentId}`);
                    setDetails(data.data);
            } catch (error) {
                console.error("Error fetching assessment details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getDetails();
    }, [assessmentId, triggerAssessmentDetails]);

    const { assessment, evaluations } = details;
    let correctAns = 0;
    let wrongAns = 0;
    let notAttempted = 0;

    evaluations.forEach(({ score }) => {
        if (score === -1) {
            wrongAns++;
        } else if (score === 4) {
            correctAns++;
        } else if (score === undefined) {
            notAttempted++;
        }
    });

    const chartData = [
        { id: 0, value: correctAns, label: `✅ Correct (${correctAns})`, color: "#4CAF50" },
        { id: 1, value: wrongAns, label: `❌ Wrong (${wrongAns})`, color: "#F44336" },
        { id: 2, value: notAttempted, label: `⚪ Not Attempted (${notAttempted})`, color: "#607D8B" },
    ];

    // Group evaluations by subject
    const groupedEvaluations = evaluations.reduce((acc, evaluation) => {
        const subject = evaluation.baseQuestion?.subject || 'General';
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(evaluation);
        return acc;
    }, {});

    // Set initial selected subject
    useEffect(() => {
        if (Object.keys(groupedEvaluations).length > 0 && !selectedSubject) {
            setSelectedSubject(Object.keys(groupedEvaluations)[0]);
        }
    }, [groupedEvaluations]);


    if (isLoading || !evaluations) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Add Download PDF button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', maxWidth: "1000px", mx: "auto", mt: 2 }}>
                <PDFDownloadButton assessment={assessment} evaluations={evaluations} />
            </Box>

            {/* Updated Test Analysis Board */}
            <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 4, mb: 6 }}>
                <Card elevation={3} sx={{ 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    bgcolor: 'white',
                    boxShadow: '0 4px 20px rgba(1,42,74,0.15)'
                }}>
                    <Box sx={{ 
                        bgcolor: '#012a4a', 
                        color: 'white', 
                        py: 3, 
                        px: 3,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ 
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '40%',
                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1))',
                            transform: 'skewX(-20deg) translateX(10%)'
                        }} />
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
                                letterSpacing: '0.5px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                Test Analysis
                            </Typography>
                            <Typography variant="subtitle1" sx={{ 
                                opacity: 0.9,
                                letterSpacing: '0.3px'
                            }}>
                                {assessment.sessionName}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ p: 4, bgcolor: '#f8f9fa' }}>
                        <Grid container spacing={4}>
                            {/* Score Summary Card */}
                            <Grid item xs={12} md={7}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 12px rgba(1,42,74,0.08)',
                                    border: '1px solid rgba(1,42,74,0.1)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                            <ScoreboardIcon sx={{ color: '#012a4a', fontSize: 28 }} />
                                            <Typography variant="h6" fontWeight="600" color="#012a4a">
                                                Performance Summary
                                            </Typography>
                                        </Stack>
                                        
                                        <Box sx={{ mb: 4, p: 2, bgcolor: '#012a4a', borderRadius: 2, color: 'white' }}>
                                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                                Score: {assessment.score} / {assessment.totalMarks}
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                                {((assessment.score / assessment.totalMarks) * 100).toFixed(1)}% of total marks
                                            </Typography>
                                        </Box>
                                        
                                        <Stack spacing={2}>
                                            <Stack 
                                                direction="row" 
                                                justifyContent="space-between" 
                                                alignItems="center"
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2, 
                                                    bgcolor: 'rgba(76,175,80,0.1)', 
                                                    color: '#2e7d32',
                                                    border: '1px solid rgba(76,175,80,0.2)'
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <CheckCircleIcon />
                                                    <Typography fontWeight="600">Correct Answers</Typography>
                                                </Stack>
                                                <Typography variant="h6" fontWeight="bold">{correctAns}</Typography>
                                            </Stack>
                                            
                                            <Stack 
                                                direction="row" 
                                                justifyContent="space-between" 
                                                alignItems="center"
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2, 
                                                    bgcolor: 'rgba(244,67,54,0.1)', 
                                                    color: '#d32f2f',
                                                    border: '1px solid rgba(244,67,54,0.2)'
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <CancelIcon />
                                                    <Typography fontWeight="600">Incorrect Answers</Typography>
                                                </Stack>
                                                <Typography variant="h6" fontWeight="bold">{wrongAns}</Typography>
                                            </Stack>
                                            
                                            <Stack 
                                                direction="row" 
                                                justifyContent="space-between" 
                                                alignItems="center"
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2, 
                                                    bgcolor: 'rgba(96,125,139,0.1)', 
                                                    color: '#455a64',
                                                    border: '1px solid rgba(96,125,139,0.2)'
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <HelpOutlineIcon />
                                                    <Typography fontWeight="600">Not Attempted</Typography>
                                                </Stack>
                                                <Typography variant="h6" fontWeight="bold">{notAttempted}</Typography>
                                            </Stack>
                                            
                                            <Stack 
                                                direction="row" 
                                                justifyContent="space-between" 
                                                alignItems="center"
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2, 
                                                    bgcolor: 'rgba(1,42,74,0.1)', 
                                                    color: '#012a4a',
                                                    border: '1px solid rgba(1,42,74,0.2)'
                                                }}
                                            >
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <AccessTimeIcon />
                                                    <Typography fontWeight="600">Time Taken</Typography>
                                                </Stack>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {getTotalTimeTaken(assessment.startTime, assessment.endTime)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Pie Chart Card */}
                            <Grid item xs={12} md={5}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'center',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 12px rgba(1,42,74,0.08)',
                                    border: '1px solid rgba(1,42,74,0.1)'
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" fontWeight="600" align="center" mb={3} color="#012a4a">
                                            Answer Distribution
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PieChart
                                                slotProps={{
                                                    legend: { 
                                                        direction: 'column', 
                                                        position: { vertical: 'middle', horizontal: 'right' },
                                                        itemMarkHeight: 8,
                                                        itemMarkWidth: 8,
                                                        labelStyle: {
                                                            fontSize: 14,
                                                            fontWeight: 500
                                                        }
                                                    },
                                                    tooltip: {
                                                        sx: {
                                                            backgroundColor: 'white',
                                                            border: '1px solid rgba(0,0,0,0.12)',
                                                            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                                                            borderRadius: 1,
                                                            p: 1
                                                        }
                                                    }
                                                }}
                        series={[
                            {
                                                        data: [
                                                            { id: 0, value: correctAns, label: `Correct (${correctAns})`, color: "#4CAF50" },
                                                            { id: 1, value: wrongAns, label: `Incorrect (${wrongAns})`, color: "#F44336" },
                                                            { id: 2, value: notAttempted, label: `Not Attempted (${notAttempted})`, color: "#9E9E9E" },
                                                        ],
                                highlightScope: { fade: 'global', highlight: 'item' },
                                                        innerRadius: 30,
                                                        paddingAngle: 2,
                                                        cornerRadius: 4,
                                                        valueFormatter: (item) => {
                                                            const percentage = evaluations.length ? 
                                                                ((item.value / evaluations.length) * 100).toFixed(1) : 0;
                                                            return `${percentage}%`;
                                                        },
                                                    },
                                                ]}
                                                height={280}
                                                margin={{ right: 120 }}
                    />
                </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Box>

            {/* AI Analysis Component */}
            <AIAnalysis analysis={details.analysis} evaluations={evaluations} />

            {/* Performance Analytics Dashboard */}
            {/* <PerformanceAnalytics 
                currentAssessment={assessment} 
                evaluations={evaluations}
            /> */}

            <Divider sx={{ my: 4 }} />

            {/* Questions Overview Component */}
            <QuestionsOverview 
                groupedEvaluations={groupedEvaluations}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                expandedRow={expandedRow}
                setExpandedRow={setExpandedRow}
            />
        </>
    );
};

export default Details;
