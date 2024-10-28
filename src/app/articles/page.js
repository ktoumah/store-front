"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { endpoints } from "@/config/endpoints";
import {
  Button,
  Container,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', content: '' });
  const [editArticle, setEditArticle] = useState(null);
  const [token, setToken] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.push('/login');
    } else {
      setToken(savedToken);
      fetchArticles(savedToken);
    }
  }, [router]);

  const fetchArticles = async (token) => {
    try {
      const response = await axios.get(endpoints.articles.userArticles, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(response.data.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
    }
  };

  const handleAddArticle = async () => {
    try {
      await axios.post(endpoints.articles.add, newArticle, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewArticle({ title: '', content: '' });
      setOpenAddDialog(false);
      fetchArticles(token);
    } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
    }
  };

  const handleEditArticle = async () => {
    try {
      if (editArticle) {
        await axios.put(endpoints.articles.update(editArticle.id), editArticle, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpenEditDialog(false);
        fetchArticles(token);
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
    }
  };

  const handleDeleteArticle = async () => {
    try {
      if (articleToDelete) {
        await axios.delete(endpoints.articles.delete(articleToDelete.id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpenDeleteDialog(false);
        fetchArticles(token);
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
          router.push('/login');
        }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Articles
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)} sx={{ mb: 2 }}>
        Ajouter Article
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Contenu</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.content}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setEditArticle(article);
                      setOpenEditDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setArticleToDelete(article);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Article Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Ajouter un nouvel article</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            value={newArticle.title}
            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            variant="outlined"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contenu"
            value={newArticle.content}
            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAddArticle} variant="contained" color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Modifier l'article</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            value={editArticle?.title || ''}
            onChange={(e) => setEditArticle({ ...editArticle, title: e.target.value })}
            variant="outlined"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contenu"
            value={editArticle?.content || ''}
            onChange={(e) => setEditArticle({ ...editArticle, content: e.target.value })}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleEditArticle} variant="contained" color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer l'article qui a le titre "{articleToDelete?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteArticle} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
