import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { useGetQuizHistoryQuery } from '../../store/slices/apiServices'; // Adjust path if needed

const ScoreProgressGraph = () => {
    const theme = useTheme();
    // Fetch the specific history data using the new hook
    const { data: historyData, isLoading, isError, error } = useGetQuizHistoryQuery();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        console.error("Error fetching quiz history:", error);
        return <Alert severity="error" sx={{ mt: 2 }}>Could not load score progress data.</Alert>;
    }

    if (!historyData || historyData.length === 0) {
        return <Typography sx={{ mt: 2, textAlign: 'center' }}>No quiz attempt history found yet.</Typography>;
    }

    // --- Process Data for MUI X LineChart ---
    // Assuming historyData is sorted and contains { score: number, date: string } or similar
    // Create labels for X-axis (e.g., Attempt numbers or Dates)
    const xAxisData = historyData.map((_, index) => `Attempt ${index + 1}`);
    // Extract scores for Y-axis
    const seriesData = historyData.map(attempt => attempt.score); // Adjust 'score' field if needed

    return (
        <Paper sx={{ p: 2, boxShadow: 1, borderRadius: 2, mt: 3, height: 400 }}>
             <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
                Score Progress Over Time
            </Typography>
            <Box sx={{ height: 'calc(100% - 48px)' }}> {/* Adjust height to fit title */}
                <LineChart
                    xAxis={[{
                        data: xAxisData,
                        scaleType: 'point', // Use 'point' scale for attempt labels
                        label: 'Attempt Number'
                    }]}
                    series={[
                        {
                            data: seriesData,
                            label: 'Score (%)',
                            color: theme.palette.primary.main, // Use theme color
                            curve: "linear", // Or "natural" for smoother curve
                            showMark: true, // Show points on the line
                        },
                    ]}
                    yAxis={[{
                        min: 0,
                        max: 100, // Assuming score is percentage
                        label: 'Score (%)'
                    }]}
                    // Optional: Add grid, tooltips customization etc.
                    grid={{ vertical: true, horizontal: true }}
                    margin={{ left: 60, right: 20, top: 20, bottom: 50 }} // Adjust margins for labels
                    sx={{
                        // Target tooltip styles if needed
                        '.MuiLineElement-root': {
                            strokeWidth: 2,
                        },
                        '.MuiMarkElement-root': {
                            scale: '0.6',
                            fill: '#fff',
                            strokeWidth: 2,
                        }
                    }}
                />
            </Box>
        </Paper>
    );
};

export default ScoreProgressGraph;
