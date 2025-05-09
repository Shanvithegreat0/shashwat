import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Grid, Card, Button, Stack, List, ListItem, ListItemIcon, ListItemText, Chip, Divider, CardContent } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetAIAnalysisMutation } from '../../store/slices/apiServices';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { format, parseISO } from 'date-fns';

const AIAnalysis = ({ evaluations, analysis }) => {
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [subjectPerformance, setSubjectPerformance] = useState([]);
  
    useEffect(() => {
        if (evaluations?.length > 0) {
            // Process subject performance from current assessment's evaluations
            const subjectData = {};
            
            evaluations.forEach(evaluation => {
                const subject = evaluation.baseQuestion?.subject || 'General';
                if (!subjectData[subject]) {
                    subjectData[subject] = { correct: 0, wrong: 0, total: 0 };
                }
                
                if (evaluation.score === 4) {
                    subjectData[subject].correct += 1;
                } else if (evaluation.score === -1) {
                    subjectData[subject].wrong += 1;
                }
                subjectData[subject].total += 1;
            });
            
            const processedSubjectData = Object.entries(subjectData).map(([subject, stats]) => ({
                subject,
                correctPercentage: ((stats.correct / stats.total) * 100).toFixed(1),
                wrongPercentage: ((stats.wrong / stats.total) * 100).toFixed(1),
                totalQuestions: stats.total
            }));
            
            setSubjectPerformance(processedSubjectData);
        }
    }, [evaluations]);


    // For demo/testing purposes
    const useTestData = false;
    useEffect(() => {
        if (useTestData) {
            const testData = {
                "overallAssessment": "Attempt 1",
                "strengths": [
                    {
                        "subject": "Mathematics",
                        "topics": ["Complex Numbers and Quadratic Equations"],
                        "accuracy": 100,
                        "score": 4
                    },
                    {
                        "subject": "Chemistry",
                        "topics": ["Some Basic Concepts in Chemistry"],
                        "accuracy": 100,
                        "score": 4
                    }
                ],
                "weaknesses": [
                    {
                        "subject": "Chemistry",
                        "topics": ["Coordination Compounds"],
                        "accuracy": 0,
                        "score": 0
                    },
                    {
                        "subject": "Chemistry",
                        "topics": ["Atomic Structure"],
                        "accuracy": 0,
                        "score": 0
                    }
                ],
                "performanceTrends": {
                    "hasTrendData": true,
                    "scoreProgression": [
                        {
                            "assessmentName": "Attempt 1",
                            "score": -12,
                            "totalMarks": 300,
                            "scorePercentage": -4,
                            "date": "2025-03-25T11:33:43.922Z"
                        },
                        {
                            "assessmentName": "Attempt 2",
                            "score": 0,
                            "totalMarks": 300,
                            "scorePercentage": 0,
                            "date": "2025-03-26T19:10:18.478Z"
                        },
                        {
                            "assessmentName": "Attempt 3",
                            "score": 16,
                            "totalMarks": 300,
                            "scorePercentage": 5.333333333333333,
                            "date": "2025-03-26T20:05:16.835Z"
                        }
                    ],
                    "topicTrends": {
                        "physics": {
                            "isNew": false,
                            "current": 0,
                            "previous": 0,
                            "change": 0,
                            "improved": false
                        },
                        "chemistry": {
                            "isNew": false,
                            "current": 0,
                            "previous": 0,
                            "change": 0,
                            "improved": false
                        }
                    }
                },
                "recommendedStudyPlan": [
                    "Focus on weak areas: Dedicate at least 2 hours daily to Chemistry and Mathematics, covering one topic from each subject per day.",
                    "Strengthen strong areas: Revise topics like Complex Numbers and Quadratic Equations (Mathematics) to maintain proficiency."
                ],
                "recommendedResources": [
                    {
                        "name": "Khan Academy",
                        "type": "Video lectures",
                        "topics": ["Sets, Relations and Functions", "Co-ordinate Geometry"],
                        "subject": "Mathematics"
                    }
                ],
                "timeManagement": {
                    "analysis": "Your current study schedule seems inefficient, leading to inconsistent performance across subjects.",
                    "recommendation": "Create a daily timetable allocating specific time slots for each subject, focusing on weak areas."
                }
            };
            setAiAnalysis(testData);
            setShowAIAnalysis(true);
        }else{
            console.log(analysis,"analysis");
            setAiAnalysis(analysis.analysisData);
        }
    }, [useTestData]);

    const formatDate = (dateString) => {
        try {
            return format(parseISO(dateString), 'MMM dd');
        } catch (error) {
            return dateString;
        }
    };

    // Prepare data for subject performance pie chart
    const getSubjectPerformanceData = () => {
        if (!aiAnalysis) return [];
        
        const subjects = new Set([
            ...aiAnalysis.strengths?.map(item => item.subject),
            ...aiAnalysis.weaknesses?.map(item => item.subject)
        ]);
        console.log(subjects);
        return Array.from(subjects)?.map(subject => {
            const strengthTopics = aiAnalysis.strengths
                .filter(s => s.subject === subject)
                .reduce((acc, s) => acc + s.topics.length, 0);
                
            const weaknessTopics = aiAnalysis.weaknesses
                .filter(w => w.subject === subject)
                .reduce((acc, w) => acc + w.topics.length, 0);
                
            const totalTopics = strengthTopics + weaknessTopics;
            const strengthPercentage = totalTopics > 0 ? (strengthTopics / totalTopics) * 100 : 0;
            
            return {
                subject,
                strengthTopics,
                weaknessTopics,
                total: totalTopics,
                strengthPercentage
            };
        });
    };

    // Group topics by subject
    const getGroupedStrengths = () => {
        if (!aiAnalysis?.strengths) return [];
        
        const groupedBySubject = {};
        
        aiAnalysis.strengths.forEach(item => {
            if (!groupedBySubject[item.subject]) {
                groupedBySubject[item.subject] = {
                    subject: item.subject,
                    topics: [],
                    accuracySum: 0,
                    count: 0
                };
            }
            
            groupedBySubject[item.subject].topics.push(...item.topics);
            groupedBySubject[item.subject].accuracySum += item.accuracy;
            groupedBySubject[item.subject].count += 1;
        });
        
        return Object.values(groupedBySubject).map(item => ({
            ...item,
            avgAccuracy: item.count > 0 ? (item.accuracySum / item.count).toFixed(1) : 0,
            // Remove duplicates from topics
            topics: [...new Set(item.topics)]
        }));
    };
    
    const getGroupedWeaknesses = () => {
        if (!aiAnalysis?.weaknesses) return [];
        
        const groupedBySubject = {};
        
        aiAnalysis.weaknesses.forEach(item => {
            if (!groupedBySubject[item.subject]) {
                groupedBySubject[item.subject] = {
                    subject: item.subject,
                    topics: [],
                    accuracySum: 0,
                    count: 0
                };
            }
            
            groupedBySubject[item.subject].topics.push(...item.topics);
            groupedBySubject[item.subject].accuracySum += item.accuracy;
            groupedBySubject[item.subject].count += 1;
        });
        
        return Object.values(groupedBySubject).map(item => ({
            ...item,
            avgAccuracy: item.count > 0 ? (item.accuracySum / item.count).toFixed(1) : 0,
            // Remove duplicates from topics
            topics: [...new Set(item.topics)]
        }));
    };

    const COLORS = ['#4CAF50', '#FFC107', '#2196F3', '#9C27B0', '#F44336'];

    // Get data for the subject comparison chart
    const getSubjectComparisonData = () => {
        if (!aiAnalysis) return [];
        
        const subjects = new Set([
            ...aiAnalysis.strengths.map(item => item.subject),
            ...aiAnalysis.weaknesses.map(item => item.subject)
        ]);
        
        return Array.from(subjects).map(subject => {
            const strengthItems = aiAnalysis.strengths.filter(s => s.subject === subject);
            const weaknessItems = aiAnalysis.weaknesses.filter(w => w.subject === subject);
            
            const avgStrengthAccuracy = strengthItems.length > 0 
                ? strengthItems.reduce((acc, item) => acc + item.accuracy, 0) / strengthItems.length 
                : 0;
                
            const avgWeaknessAccuracy = weaknessItems.length > 0 
                ? weaknessItems.reduce((acc, item) => acc + item.accuracy, 0) / weaknessItems.length 
                : 0;
            
            return {
                subject,
                strongAccuracy: avgStrengthAccuracy,
                weakAccuracy: avgWeaknessAccuracy,
                overallAccuracy: (avgStrengthAccuracy + avgWeaknessAccuracy) / 2,
                strongTopics: strengthItems.reduce((acc, item) => acc + item.topics.length, 0),
                weakTopics: weaknessItems.reduce((acc, item) => acc + item.topics.length, 0)
            };
        }).sort((a, b) => b.overallAccuracy - a.overallAccuracy);
    };

    return (
        <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 4, mb: 6 }}>
            <Card elevation={3} sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(1,42,74,0.15)'
            }}>
                <Box sx={{ 
                    bgcolor: '#6200EE', 
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
                        <Stack direction="row" alignItems="center" spacing={2}>
                        <SchoolIcon sx={{ fontSize: 32 }} />
                        <Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
                                    letterSpacing: '0.5px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                AI Tutor Analysis
                            </Typography>
                                <Typography variant="subtitle1" sx={{ 
                                    opacity: 0.9,
                                    letterSpacing: '0.3px'
                                }}>
                                Get personalized feedback and recommendations
                            </Typography>
                        </Box>
                    </Stack>
                    </Box>
                </Box>
                
                <Box sx={{ p: 4, bgcolor: '#f8f9fa' }}>
                    {/* Overall Assessment */}
                    <Card sx={{ 
                        mb: 4,
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(1,42,74,0.08)',
                        border: '1px solid rgba(1,42,74,0.1)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                <TipsAndUpdatesIcon sx={{ color: '#012a4a', fontSize: 28 }} />
                                <Typography variant="h6" fontWeight="600" color="#012a4a">
                                Overall Assessment
                                </Typography>
                            </Stack>
                            <Typography variant="body1" color="text.secondary" sx={{ 
                                bgcolor: 'rgba(1,42,74,0.05)',
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(1,42,74,0.1)'
                            }}>
                                {aiAnalysis?.overallAssessment}
                                            </Typography>
                                        </CardContent>
                                    </Card>

                    {/* Strengths & Weaknesses */}
                    <Grid container spacing={4} mb={4}>
                        {/* Weaknesses */}
                        <Grid item xs={12}>
                            <Card sx={{ 
                                height: '100%',
                                borderRadius: 2,
                                boxShadow: '0 2px 12px rgba(1,42,74,0.08)',
                                border: '1px solid rgba(1,42,74,0.1)'
                            }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                        <EmojiObjectsIcon sx={{ color: '#FFC107', fontSize: 28 }} />
                                        <Typography variant="h6" fontWeight="600" color="#012a4a">
                                            Areas for Improvement
                                            </Typography>
                                    </Stack>
                                    {getGroupedWeaknesses().map((subject, index) => (
                                        <Box key={index} sx={{ mb: 3, last: { mb: 0 } }}>
                                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                <MenuBookIcon sx={{ color: '#012a4a' }} />
                                                <Typography variant="subtitle1" fontWeight="600" color="#012a4a">
                                                    {subject.subject}
                                                </Typography>
                                                <Chip 
                                                    label={`${subject.avgAccuracy}% accuracy`}
                                                    size="small" 
                                                    sx={{ 
                                                        bgcolor: 'rgba(244,67,54,0.1)',
                                                        color: '#d32f2f',
                                                        fontWeight: 600
                                                    }}
                                                />
                                            </Stack>
                                            <Box sx={{ 
                                                pl: 4,
                                                borderLeft: '2px solid rgba(1,42,74,0.1)',
                                                ml: 1
                                            }}>
                                                {subject.topics.map((topic, topicIndex) => (
                                                    <Typography 
                                                        key={topicIndex} 
                                                        variant="body2" 
                                                        color="text.secondary"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        • {topic}
                                            </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    ))}
                                </CardContent>
                                        </Card>
                                    </Grid>
                            </Grid>

                    {/* Recommended Study Plan */}
                    <Card sx={{ 
                        mb: 4,
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(1,42,74,0.08)',
                        border: '1px solid rgba(1,42,74,0.1)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                <LocalLibraryIcon sx={{ color: '#012a4a', fontSize: 28 }} />
                                <Typography variant="h6" fontWeight="600" color="#012a4a">
                                    Recommended Study Plan
                            </Typography>
                            </Stack>
                            <List sx={{ 
                                bgcolor: 'rgba(1,42,74,0.05)',
                                borderRadius: 2,
                                border: '1px solid rgba(1,42,74,0.1)'
                            }}>
                                {aiAnalysis?.recommendedStudyPlan?.map((plan, index) => (
                                    <ListItem key={index} sx={{ py: 1.5 }}>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <Box 
                                                sx={{ 
                                                    width: 24, 
                                                    height: 24, 
                                                    borderRadius: '50%',
                                                    bgcolor: '#012a4a',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={plan}
                                            primaryTypographyProps={{
                                                color: 'text.secondary',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Time Management */}
                    <Card sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(1,42,74,0.08)',
                        border: '1px solid rgba(1,42,74,0.1)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                                <AccessTimeIcon sx={{ color: '#012a4a', fontSize: 28 }} />
                                <Typography variant="h6" fontWeight="600" color="#012a4a">
                                    Time Management
                                </Typography>
                            </Stack>
                            <Box sx={{ 
                                bgcolor: 'rgba(1,42,74,0.05)',
                                p: 2,
                                borderRadius: 2,
                                border: '1px solid rgba(1,42,74,0.1)'
                            }}>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    {aiAnalysis?.timeManagement?.analysis}
                                    </Typography>
                                <Typography 
                                    variant="body1" 
                                    color="text.secondary" 
                                    sx={{ 
                                        mt: 2,
                                        pt: 2,
                                        borderTop: '1px solid rgba(1,42,74,0.1)'
                                    }}
                                >
                                    <strong>Recommendation:</strong> {aiAnalysis?.timeManagement?.recommendation}
                                    </Typography>
                            </Box>
                        </CardContent>
                            </Card>
                        </Box>
            </Card>
        </Box>
    );
};

export default AIAnalysis; 