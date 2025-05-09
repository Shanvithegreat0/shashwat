// import React, { useState, useEffect } from 'react'
// import { Grid2, Alert, Box } from '@mui/material'
// import QuizComponent from './QuizComponent'
// import { useNavigate, useParams } from 'react-router'
// import { useCreateAssessmentMutation } from '../../store/slices/apiServices';
// import FullScreenLoader from './quizComponents/FullScreenLoader';
// import { useToast } from '../../components/Toasts/useToast';

// export const saveSession = (
//   questions,
//   index,
//   id,
//   totalTime,
//   createdAt,
//   sessionCompleted
// ) => {
//   const sessionToSave = {
//     questions,
//     currentIndex: index,
//     lastUpdated: new Date().toISOString(),
//     createdAt: createdAt,
//     sessionCompleted: sessionCompleted,
//     totalTime: totalTime
//   };

//   localStorage.setItem(`assessment_${id}`, JSON.stringify(sessionToSave));
// };

// const QuizPage = () => {
//   const navigate = useNavigate()
//   const { examId, moduleId, topicId, type, subjectId } = useParams();
//   const [questionData, setQuestionData] = useState([]);
//   const [assessmentData, setAssessmentData] = useState(null);
//   const [error, setError] = useState(null);
//   const { showToast } = useToast()
//   const [triggerAssessment, { isLoading }] = useCreateAssessmentMutation()

//   useEffect(() => {
//     const createAssessment = async () => {
//       try {
//         let body = {}

//         if (type == 'module') {
//           body = {
//             examSlug: examId,
//             quizType: type,
//             moduleSlug: moduleId,
//             type: 'quiz'
//           }
//         } else if (type == 'subject') {
//           body = {
//             examSlug: examId,
//             quizType: type,
//             moduleSlug: moduleId,
//             subjectSlug: subjectId,
//             type: 'quiz'
//           }
//         } else if (type == 'topic') {
//           body = {
//             examSlug: examId,
//             quizType: type,
//             moduleSlug: moduleId,
//             subjectSlug: subjectId,
//             topicSlug: topicId,
//             type: 'quiz'
//           }
//         }

//         const { data } = await triggerAssessment(body).unwrap();
//         console.log("Assessment API response:", JSON.stringify(data, null, 2));
        
//         setAssessmentData(data.assessment);
//         if (data?.evaluation && data.evaluation.length > 0) {
//           console.log("Evaluation data received:", data.evaluation.length, "questions");
//           console.log("First question structure:", data.evaluation[0] ? JSON.stringify(data.evaluation[0], null, 2) : "No questions");
          
//           // Make a deep copy of the evaluation data to avoid reference issues
//           const evaluationCopy = JSON.parse(JSON.stringify(data.evaluation));
//           setQuestionData(evaluationCopy);
//           saveSession(evaluationCopy, 0, data.assessment._id, data?.assessment?.totalTime, data?.assessment?.createdAt, data?.assessment?.sessionCompleted);
//         } else {
//           console.error("No evaluation data in response:", data);
//           setError("No questions available for this assessment");
//           showToast({ message: "No questions available for this assessment", type: "error" });
//         }
//       } catch (e) {
//         console.error("Assessment creation error:", e.message);
//         setError(e.message);
//         showToast({ message: "Failed to create assessment", type: "error" });
//         navigate('/exams');
//       }
//     };

//     createAssessment();
//   }, []);

//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">{error}</Alert>
//       </Box>
//     );
//   }

//   if (isLoading || !questionData || questionData.length === 0 || !assessmentData) {
//     return <FullScreenLoader message={'Loading...'} />;
//   }

//   return (
//     <Grid2 container spacing={"24px"}>
//       <QuizComponent 
//         type={type} 
//         questionData={questionData} 
//         setQuestionData={setQuestionData} 
//         assessment={assessmentData} 
//       />
//     </Grid2>
//   );
// }

// export default QuizPage

import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import QuizComponent from './QuizComponent'
import { useNavigate, useParams } from 'react-router'
import { useCreateAssessmentMutation } from '../../store/slices/apiServices';
import FullScreenLoader from './quizComponents/FullScreenLoader';
import { useToast } from '../../components/Toasts/useToast';

export const saveSession = (
  questions,
  index,
  id,
  totalTime,
  createdAt,
  sessionCompleted
) => {
  const sessionToSave = {
    questions,
    currentIndex: index,
    lastUpdated: new Date().toISOString(),
    createdAt: createdAt,
    sessionCompleted: sessionCompleted,
    totalTime: totalTime
  };

  localStorage.setItem(`assessment_${id}`, JSON.stringify(sessionToSave));
};

const QuizPage = () => {
  const navigate = useNavigate()
  const { examId, moduleId, topicId, type, subjectId } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [assessmentData, setAssessmentData] = useState([]);
  const { showToast } = useToast()
  const [triggerAssessment, { isLoading }] = useCreateAssessmentMutation()

  useEffect(() => {
    const createAssessment = async () => {
      try {
        let body = {}

        if (type == 'module') {
          body = {
            examSlug: examId,
            quizType: type,
            moduleSlug: moduleId,
            type: 'quiz'
          }
        } else if (type == 'subject') {
          body = {
            examSlug: examId,
            quizType: type,
            moduleSlug: moduleId,
            subjectSlug: subjectId,
            type: 'quiz'
          }
        } else if (type == 'topic') {
          body = {
            examSlug: examId,
            quizType: type,
            moduleSlug: moduleId,
            subjectSlug: subjectId,
            topicSlug: topicId,
            type: 'quiz'
          }
        }

        const { data } = await triggerAssessment(body).unwrap();
        setAssessmentData(data.assessment);
        if (data?.evaluation) {
          setQuestionData([...data.evaluation]);
          saveSession([...data.evaluation], 0, data.assessment._id, data?.assessment?.totalTime, data?.assessment?.createdAt, data?.assessment?.sessionCompleted)
        }
      } catch (e) {
        console.error("Assessment creation error:", e.message);
        showToast({ message: "Failed to create assessment", type: "error" })
        navigate('/exams')
      }
    };

    createAssessment();
  }, []);

  return (
    <>
      {isLoading && <FullScreenLoader message={'Loading...'} />}
      <Grid2 container spacing={"24px"} >
        <QuizComponent type={type} questionData={questionData} setQuestionData={setQuestionData} assessment={assessmentData} />
      </Grid2>
    </>
  )
}

export default QuizPage