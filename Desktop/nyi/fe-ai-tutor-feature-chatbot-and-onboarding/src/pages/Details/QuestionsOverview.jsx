import React from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Collapse, Tabs, Tab, IconButton } from "@mui/material";
import { useState } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const QuestionsOverview = ({ groupedEvaluations, selectedSubject, setSelectedSubject, expandedRow, setExpandedRow }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExplanation = (index) => {
        setIsExpanded(prevExpanded => !prevExpanded);
        setExpandedRow(prevExpanded ? null : index);
    };

    return (
        <>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mt={4} mb={1}>Questions Overview</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                Click on any question to view explanation
            </Typography>

            {/* Subject Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                    value={selectedSubject}
                    onChange={(_, newValue) => setSelectedSubject(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                        '& .MuiTab-root': { 
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            textTransform: 'none'
                        }
                    }}
                >
                    {Object.keys(groupedEvaluations).map((subject) => (
                        <Tab 
                            key={subject} 
                            label={`${subject} (${groupedEvaluations[subject].length})`}
                            value={subject}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Questions Table */}
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f9f9f9" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "600", width: '5%', py: 2 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: "600", width: '40%' }}>Question</TableCell>
                            <TableCell sx={{ fontWeight: "600", width: '15%' }}>Your Answer</TableCell>
                            <TableCell sx={{ fontWeight: "600", width: '15%' }}>Correct Answer</TableCell>
                            <TableCell sx={{ fontWeight: "600", width: '15%' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: "600", width: '10%' }}>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedSubject && groupedEvaluations[selectedSubject]?.map((q, index) => {
                            const isCorrect = q.userAnswer === q.baseAnswer;
                            const notAttempted = !q.userAnswer;
                            const isExpanded = expandedRow === index;
                            return (
                                <React.Fragment key={q._id || index}>
                                    <TableRow 
                                        sx={{ 
                                            '&:hover': { 
                                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                cursor: 'pointer' 
                                            },
                                            borderLeft: '4px solid',
                                            borderLeftColor: isCorrect 
                                                ? 'success.main' 
                                                : notAttempted 
                                                    ? 'grey.400' 
                                                    : 'error.main',
                                            transition: 'all 0.2s'
                                        }} 
                                        onClick={() => handleToggleExplanation(index)}
                                    >
                                        <TableCell sx={{ borderBottom: isExpanded ? 0 : '1px solid rgba(224, 224, 224, 1)' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell 
                                            sx={{ 
                                                borderBottom: isExpanded ? 0 : '1px solid rgba(224, 224, 224, 1)',
                                                fontWeight: 500
                                            }}
                                        >
                                            {q.baseQuestion.questionText}
                                        </TableCell>
                                        <TableCell 
                                            sx={{ 
                                                borderBottom: isExpanded ? 0 : '1px solid rgba(224, 224, 224, 1)',
                                                color: isCorrect ? "success.main" : notAttempted ? "text.secondary" : "error.main",
                                                fontWeight: 500
                                            }}
                                        >
                                            {q.userAnswer || "Not answered"}
                                        </TableCell>
                                        <TableCell 
                                            sx={{ 
                                                borderBottom: isExpanded ? 0 : '1px solid rgba(224, 224, 224, 1)',
                                                fontWeight: 500
                                            }}
                                        >
                                            {q.baseAnswer}
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: isExpanded ? 0 : '1px solid rgba(224, 224, 224, 1)' }}>
                                            <Chip 
                                                label={isCorrect ? "Correct" : notAttempted ? "Not Attempted" : "Incorrect"} 
                                                color={isCorrect ? "success" : notAttempted ? "default" : "error"} 
                                                variant="outlined"
                                                size="small"
                                                sx={{ 
                                                    fontWeight: 500,
                                                    px: 1,
                                                    '& .MuiChip-label': { px: 1 }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell 
                                            align="center" 
                                            sx={{ 
                                                borderBottom: isExpanded ? 0 : '1px solid rgba(224, 224, 224, 1)',
                                                color: 'primary.main'
                                            }}
                                        >
                                            <IconButton 
                                                size="small" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleExplanation(index);
                                                }}
                                                sx={{ mr: 1 }}
                                            >
                                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ backgroundColor: isExpanded ? 'rgba(25, 118, 210, 0.04)' : 'inherit' }}>
                                        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                <Box 
                                                    sx={{ 
                                                        py: 2.5, 
                                                        px: 3, 
                                                        mx: 2,
                                                        my: 1.5,
                                                        backgroundColor: "white", 
                                                        borderRadius: 1,
                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                                        border: '1px solid rgba(0,0,0,0.08)'
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }} >
                                                        {q.explanation && "Explanation:"}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                                        {q.explanation ? q.explanation : "Explanation is not available."}
                                                    </Typography>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default QuestionsOverview; 