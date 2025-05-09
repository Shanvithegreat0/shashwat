import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, TablePagination, Box
} from "@mui/material";
import { useParams } from 'react-router-dom';
import { useGetAllAssessmentsMutation } from "../../store/slices/apiServices";
import { useNavigate } from 'react-router-dom';

const Attempts = () => {
    const {entityType, entityId} = useParams();
    
    const [attempts, setAttempts] = useState([]);
    const [entityData, setEntityData] = useState(null);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [page, setPage] = useState(0); 
    const [rowsPerPage, setRowsPerPage] = useState(15); 
    const [triggerAttempts] = useGetAllAssessmentsMutation();
    const navigate = useNavigate();

    const fetchData = async (currentPage, pageLimit) => {
        try {
            const { data } = await triggerAttempts(`?entityType=${entityType}&entitySlug=${entityId}&page=${currentPage + 1}&limit=${pageLimit}`);
            setAttempts(data?.data?.assessments || []);
            setEntityData(data?.data?.entityData || null);
            setTotalAttempts(data?.data?.total || 0);
        } catch (error) {
            console.error("Error fetching attempts:", error);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    useEffect(() => {
        fetchData(page, rowsPerPage);
    }, [page, rowsPerPage, entityType, entityId]);

    return (
        <TableContainer component={Paper} sx={{ mt: 2, p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Assessment Attempts
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        {["Session Name", "Exam", "Questions Attempted", "Score"].map((header, index) => (
                            <TableCell key={index}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attempts.length > 0 ? (
                        attempts.map((attempt) => (
                            <TableRow 
                                key={attempt._id} 
                                hover 
                                onClick={() => navigate(`/quiz/result/${attempt.slug}`)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                            >
                                <TableCell>{attempt.sessionName}</TableCell>
                                <TableCell>{entityData?.name}</TableCell>
                                <TableCell>{attempt.answeredQuestion} / {attempt.totalQuestions}</TableCell>
                                <TableCell>{attempt.score} / {attempt.totalMarks}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No assessment attempts found
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            <TablePagination
                rowsPerPageOptions={[15, 20, 25, 30]}
                component="div"
                count={totalAttempts}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </TableContainer>
    );
};

export default Attempts;