import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, Paper, Alert, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useComments } from '../contexts/CommentsContext';
import { addComment, getGameComments } from '../lib/firebase/comments';
import { auth } from '../lib/firebase/init';

export default function CommentSection({ gameId }) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { state, dispatch } = useComments();
  const currentUser = auth.currentUser;

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      if (!mounted || !currentUser) return;
      
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        const comments = await getGameComments(gameId);
        if (mounted && comments) {
          dispatch({ type: 'SET_COMMENTS', payload: comments });
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching comments:', error);
          dispatch({ type: 'SET_ERROR', payload: 'コメントの取得に失敗しました' });
        }
      } finally {
        if (mounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    fetchComments();

    return () => {
      mounted = false;
    };
  }, [gameId, dispatch, currentUser]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUser || submitting) return;

    setSubmitting(true);
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const commentData = {
        gameId,
        userId: currentUser.uid,
        userEmail: currentUser.email || '不明なユーザー',
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      const savedComment = await addComment(commentData);
      
      if (savedComment) {
        dispatch({ type: 'ADD_COMMENT', payload: savedComment });
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      dispatch({ type: 'SET_ERROR', payload: 'コメントの投稿に失敗しました' });
    } finally {
      setSubmitting(false);
    }
  };

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        ファンコメント
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      {!currentUser ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          コメントを投稿するにはログインが必要です
        </Alert>
      ) : (
        <Box mb={3}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="試合の感想を共有しましょう..."
            variant="outlined"
            disabled={submitting}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
            sx={{
              bgcolor: '#000000',
              color: '#FFD700',
              '&:hover': {
                bgcolor: '#222222',
              }
            }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: '#FFD700' }} /> : 'コメントを投稿'}
          </Button>
        </Box>
      )}

      <Box>
        {state.comments.map((comment) => (
          <Paper 
            key={comment.id} 
            sx={{ 
              p: 2, 
              mb: 2,
              border: '1px solid #FFD700',
              borderRadius: '8px'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar sx={{ mr: 1, bgcolor: '#FFD700', color: '#000000' }}>
                {comment.userEmail[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {comment.userEmail}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(comment.timestamp), 'yyyy年M月d日(E) HH:mm', { locale: ja })}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ ml: 6 }}>{comment.content}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}