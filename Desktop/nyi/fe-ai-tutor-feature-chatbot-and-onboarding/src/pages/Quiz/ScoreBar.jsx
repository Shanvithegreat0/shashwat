/* eslint-disable react/prop-types */
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { getProgressColor } from "../../utils/helper";

const ScoreInfo = (
    {
        assessment,
        questionsData,
        currentIndex,
        remainingTime,
        setCurrentIndex
    }
) => {
    // Format the remaining time
    // const formatTime = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const remainingSeconds = seconds % 60;
    //     return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    // };


    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
    
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    };
    

    // Calculate the percentage for the timer progress
    const calculateTimePercentage = () => {
        if (!assessment || !assessment.totalTime) return 100;
        const totalSeconds = assessment.totalTime * 60;
        return (remainingTime / totalSeconds) * 100;
    };

    const timePercentage = calculateTimePercentage();
    const progressColor = getProgressColor(timePercentage);

    return (
        <Box
            sx={{
                
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: 2,
                borderLeft: "2px solid #e0e0e0",
                backgroundColor: "#f9f9f9",
            }}
        >
            {/* Timer display */}
            <Box
                sx={{
                    borderRadius: "4px",
                    mx: "auto",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        color: "text.primary",
                        mb: 2,
                        textAlign: "center"
                    }}
                >
                    Time Left
                </Typography>
                <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                    <CircularProgress
                        variant="determinate"
                        value={timePercentage}
                        size={120}
                        thickness={3}
                        color={timePercentage < 25 ? "error" : timePercentage < 50 ? "warning" : "primary"}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "bold",
                                color: timePercentage < 25 ? "error.main" : "text.primary",
                            }}
                        >
                            {formatTime(remainingTime)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Divider />

            {/* Tiles color legends */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    padding: 1,
                    borderRadius: "8px",
                    py: 2,
                    gap: 1,
                }}
            >
                {[
                    { color: "green", label: "Answered" },
                    { color: "grey", label: "Unattempted" },
                    { color: "lightblue", label: "Current" },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            marginRight: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: item.color,
                                borderRadius: "50%",
                            }}
                        ></Box>
                        <Typography variant="caption">{item.label}</Typography>
                    </Box>
                ))}
            </Box>
            <Divider />

            {/* Questions Status Tiles */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "12px",
                    py: 2,
                }}
            >
                {questionsData?.map((q, index) => (
                    <Box
                        key={q._id || index}
                        sx={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor:
                                index === currentIndex
                                    ? "lightblue"
                                    : q.status === "answered" || q.userAnswer
                                        ? "green"
                                        : "grey",
                            color: "white",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setCurrentIndex(index);
                        }}
                    >
                        {index + 1}
                    </Box>
                ))}
            </Box>
            
            {/* Quiz Summary */}
            <Box sx={{ mt: 2 }}>
                <Divider />
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                    Quiz Summary
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Total Questions: {questionsData?.length || 0}
                </Typography>
                <Typography variant="body2">
                    Answered: {questionsData?.filter(q => q.userAnswer || q.status === "answered")?.length || 0}
                </Typography>
                <Typography variant="body2">
                    Remaining: {questionsData?.filter(q => !q.userAnswer && q.status !== "answered")?.length || 0}
                </Typography>
            </Box>
        </Box>
    );
};

export default ScoreInfo