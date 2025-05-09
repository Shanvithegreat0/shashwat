import React, { useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Onboarding from '../pages/Onboarding/index';

// Add styles for the backdrop
const dialogStyles = `
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }
  
  dialog {
    border: none;
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
  }
`;

const OnboardingModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (modalRef.current) {
      modalRef.current.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    // Close the modal when clicking outside of it
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <>
      <style>{dialogStyles}</style>
      <dialog
        ref={modalRef}
        onClick={handleBackdropClick}
        style={{
          padding: 0,
          maxWidth: '90%',
          maxHeight: '90%',
          width: '800px',
          overflow: 'hidden',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1000,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'background.paper',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ 
            height: '80vh', 
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '4px',
            },
          }}>
            <Onboarding inModal={true} onComplete={onClose} />
          </Box>
        </Box>
      </dialog>
    </>
  );
};

export default OnboardingModal; 