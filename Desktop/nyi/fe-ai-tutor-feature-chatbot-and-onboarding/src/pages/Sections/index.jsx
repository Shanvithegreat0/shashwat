import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Topic as TopicIcon,
} from '@mui/icons-material';
import {
  useGetSectionsBySubjectQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from '../../store/slices/apiServices';

const Sections = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  // API hooks
  const { data: sections, isLoading } = useGetSectionsBySubjectQuery(subjectId);
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  // Local state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleOpenDialog = (section = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        name: section.name,
        description: section.description,
      });
    } else {
      setEditingSection(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSection(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingSection) {
        await updateSection({
          id: editingSection._id,
          ...formData,
          subjectId,
        }).unwrap();
      } else {
        await createSection({
          ...formData,
          subjectId,
        }).unwrap();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleOpenMenu = (event, section) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSection(section);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedSection(null);
  };

  const handleDelete = async () => {
    try {
      await deleteSection(selectedSection._id).unwrap();
      handleCloseMenu();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleViewTopics = (sectionId) => {
    navigate(`/sections/${sectionId}/topics`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Sections
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#012a4a' }}
        >
          Add Section
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sections?.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" component="h2" gutterBottom>
                    {section.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenMenu(e, section)}
                    sx={{ mt: -1, mr: -1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<TopicIcon />}
                  onClick={() => handleViewTopics(section._id)}
                  sx={{ color: '#012a4a' }}
                >
                  View Topics
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Section Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSection ? 'Edit Section' : 'Add New Section'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Section Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#012a4a' }}
          >
            {editingSection ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          handleOpenDialog(selectedSection);
          handleCloseMenu();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Sections; 