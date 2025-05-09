import { useParams } from "react-router";
import {
  useGetExamByIdQuery,
  useGetUserRecordsMutation,
} from "../../store/slices/apiServices";
import {
  Box,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import ModulesDashboard from "./ModulesDashboard";
import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";

const ExamDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userRecord, setUserRecord] = useState();
  const [moduleData, setModuleData] = useState();

  const { data: data, isLoading } = useGetExamByIdQuery({ slug: id }, { skip: !id });
  // const { data: data, isLoading } = useGetExamByIdQuery({ id: id }, { skip: !id });
  const [triggerRecords] = useGetUserRecordsMutation(user.id);

  useEffect(() => {
    const getUserRecords = async () => {
      const { data: userData } = await triggerRecords();
      setUserRecord(userData)
    }

    getUserRecords()
  }, [])

  useEffect(() => {
    const processRecords = (records) => {
      let modules = [];
      let subjects = [];

      records.forEach(record => {
        if (!record.subject) {
          // Process as module stats
          modules.push({
            id: record.examModule?.id || 0,
            name: record.examModule?.name || 0,
            averageScore: record.averageScore || 0,
            attempts: record.attempt || 0,
            lastAttemptScore: record.lastAttemptScore || 0,
            highestScore: record.highestScore || 0,
            totalMarks : record.totalMarks || 0,
            performanceStatus: record.averageScore >= 50 ? 'Good' : 'Average'
          });
        } else {
          // Process as subject stats
          subjects.push({
            id: record.subject.id,
            name: record.subject.name,
            averageScore: record.averageScore.toFixed(2) || 0,
            attempts: record.attempt || 0,
            lastAttemptScore: record.lastAttemptScore || 0,
            totalMarks : record.totalMarks || 0,
            highestScore: record.highestScore || 0,
            performanceStatus: record.averageScore >= 50 ? 'Good' : 'Average'
          });
        }
      });

      return { module: modules, subject: subjects };
    };

    const data = userRecord?.data?.data ? processRecords(userRecord?.data?.data) : []
    setModuleData(data)
  }, [userRecord])

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
          {[...data?.data?.modules].reverse().map((module) => {
            
            const moduleDataMatch = moduleData?.module?.find((mod) => mod.id === module._id);
            return (
              <ModulesDashboard
                key={module._id}
                moduleData={module}  // Use matched moduleData if found, otherwise fallback to module
                examId={id}
                userRecord={userRecord?.data?.data}
                moduleRecord={moduleDataMatch}
              />
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default ExamDetails;