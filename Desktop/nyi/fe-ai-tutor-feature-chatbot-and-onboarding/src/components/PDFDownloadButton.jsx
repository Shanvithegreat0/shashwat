import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const PDFDownloadButton = ({ assessment, evaluations }) => {
  const [loading, setLoading] = useState(false);
  
  const downloadPDF = async () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Basic styling
      const primaryColor = [33, 150, 243]; // Blue
      const secondaryColor = [76, 175, 80]; // Green
      const errorColor = [244, 67, 54]; // Red
      
      // Add title with styling
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Assessment Report', 105, 25, { align: 'center' });
      
      // Add assessment info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Session: ${assessment.sessionName}`, 14, 50);
      doc.text(`Date: ${format(new Date(assessment.endTime || new Date()), 'PPP')}`, 14, 58);
      
      // Add score with visual indicator
      doc.setFontSize(16);
      doc.text(`Score: ${assessment.score} / ${assessment.totalMarks}`, 14, 70);
      
      // Add score percentage
      const scorePercentage = ((assessment.score / assessment.totalMarks) * 100).toFixed(1);
      doc.setFontSize(12);
      doc.text(`Performance: ${scorePercentage}%`, 14, 78);
      
      // Draw progress bar
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(200, 200, 200);
      doc.roundedRect(14, 82, 180, 8, 3, 3, 'FD');
      
      doc.setDrawColor(...primaryColor);
      doc.setFillColor(...primaryColor);
      doc.roundedRect(14, 82, 180 * (assessment.score / assessment.totalMarks), 8, 3, 3, 'FD');
      
      // Calculate statistics
      let correctAns = 0;
      let wrongAns = 0;
      let notAttempted = 0;
      
      evaluations.forEach(({ score, userAnswer }) => {
        if (score === 4 || (userAnswer && score > 0)) correctAns++;
        else if (score === -1 || (userAnswer && score <= 0)) wrongAns++;
        else notAttempted++;
      });
      
      // Add summary statistics
      doc.text("Summary Statistics", 14, 100);
      doc.line(14, 102, 60, 102);
      
      // Create summary table
      autoTable(doc, {
        startY: 110,
        head: [['Metric', 'Count', 'Percentage']],
        body: [
          ['Correct Answers', correctAns, `${((correctAns / evaluations.length) * 100).toFixed(1)}%`],
          ['Wrong Answers', wrongAns, `${((wrongAns / evaluations.length) * 100).toFixed(1)}%`],
          ['Not Attempted', notAttempted, `${((notAttempted / evaluations.length) * 100).toFixed(1)}%`],
          ['Total Questions', evaluations.length, '100%']
        ],
        theme: 'grid',
        headStyles: { fillColor: primaryColor },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 40, halign: 'center' },
          2: { cellWidth: 40, halign: 'center' }
        },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      
      // Group by subjects
      const subjectGroups = {};
      evaluations.forEach(evaluation => {
        const subject = evaluation.baseQuestion?.subject || 'General';
        if (!subjectGroups[subject]) {
          subjectGroups[subject] = { 
            questions: [], 
            correct: 0, 
            incorrect: 0, 
            notAttempted: 0 
          };
        }
        
        // Count by subject
        if (evaluation.score === 4 || (evaluation.userAnswer && evaluation.score > 0)) {
          subjectGroups[subject].correct++;
        } else if (evaluation.score === -1 || (evaluation.userAnswer && evaluation.score <= 0)) {
          subjectGroups[subject].incorrect++;
        } else {
          subjectGroups[subject].notAttempted++;
        }
        
        subjectGroups[subject].questions.push(evaluation);
      });
      
      // Add subject-wise performance section
      doc.addPage();
      
      // Title for subject-wise section
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('Subject-wise Performance', 105, 20, { align: 'center' });
      
      // Subject tables
      let yPos = 40;
      
      Object.entries(subjectGroups).forEach(([subject, data]) => {
        const total = data.questions.length;
        const correctPercentage = (data.correct / total * 100).toFixed(1);
        const incorrectPercentage = (data.incorrect / total * 100).toFixed(1);
        const notAttemptedPercentage = (data.notAttempted / total * 100).toFixed(1);
        
        // Check if we need a new page
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }
        
        // Subject heading
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`${subject}`, 14, yPos);
        yPos += 8;
        
        // Performance bar
        doc.setFillColor(200, 200, 200);
        doc.rect(14, yPos, 180, 10, 'F');
        
        // Correct portion
        if (data.correct > 0) {
          doc.setFillColor(...secondaryColor);
          doc.rect(14, yPos, 180 * (data.correct / total), 10, 'F');
        }
        
        // Incorrect portion
        if (data.incorrect > 0) {
          doc.setFillColor(...errorColor);
          doc.rect(14 + 180 * (data.correct / total), yPos, 180 * (data.incorrect / total), 10, 'F');
        }
        
        yPos += 16;
        
        // Stats table
        autoTable(doc, {
          startY: yPos,
          head: [['Type', 'Count', 'Percentage']],
          body: [
            ['Correct', data.correct, `${correctPercentage}%`],
            ['Incorrect', data.incorrect, `${incorrectPercentage}%`],
            ['Not Attempted', data.notAttempted, `${notAttemptedPercentage}%`],
          ],
          theme: 'plain',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 40, halign: 'center' },
            2: { cellWidth: 40, halign: 'center' }
          },
        });
        
        yPos = doc.lastAutoTable.finalY + 20;
      });
      
      // Questions detail section
      doc.addPage();
      
      // Title for questions section
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('Questions Detail', 105, 20, { align: 'center' });
      
      yPos = 40;
      
      Object.entries(subjectGroups).forEach(([subject, data]) => {
        // Check for new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        // Subject heading
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`${subject} Questions`, 14, yPos);
        yPos += 10;
        
        // Create table rows for this subject
        const tableData = data.questions.map((q, idx) => {
          const isCorrect = q.userAnswer === q.baseAnswer;
          const notAttempted = !q.userAnswer;
          const status = isCorrect ? 'Correct' : notAttempted ? 'Not Attempted' : 'Incorrect';
          
          return [
            idx + 1, 
            q.baseQuestion.questionText.substring(0, 50) + (q.baseQuestion.questionText.length > 50 ? '...' : ''),
            q.userAnswer || 'Not answered',
            q.baseAnswer,
            status
          ];
        });
        
        // Create the table
        autoTable(doc, {
          startY: yPos,
          head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: primaryColor },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 80 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 }
          },
          didDrawPage: (data) => {
            // Footer
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, pageHeight - 10);
          }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      });
      
      // Save the PDF
      doc.save(`${assessment.sessionName || 'Assessment'}_Report.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
      onClick={downloadPDF}
      disabled={loading}
      sx={{ ml: 2 }}
    >
      {loading ? 'Generating...' : 'Download PDF Report'}
    </Button>
  );
};

export default PDFDownloadButton; 