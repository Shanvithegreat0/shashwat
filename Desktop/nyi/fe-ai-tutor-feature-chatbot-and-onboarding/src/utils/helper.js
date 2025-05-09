export const getProgressColor = (
    scorePercentage
) => {
    if (scorePercentage >= 80) return "success";
    if (scorePercentage >= 50) return "warning";
    return "error";
};

export const getTotalTimeTaken = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    let diff = end.getTime() - start.getTime(); 

    if (diff <= 0) return "0ms";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff %= (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff %= (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    // const milliseconds = diff % 1000;

    let result = [];
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (seconds > 0) result.push(`${seconds}s`);
    // if (milliseconds > 0) result.push(`${milliseconds}ms`);

    return result.join(" ") || "0ms";
};