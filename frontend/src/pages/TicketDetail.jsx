import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (err) {
      setError('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/ticket/${id}`);
      setComments(response.data);
    } catch (err) {
      setError('Failed to fetch comments');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await api.post('/comments', {
        content: newComment,
        ticketId: id
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'in_progress': return 'badge badge-warning';
      case 'resolved': return 'badge badge-info';
      case 'closed': return 'badge badge-secondary';
      default: return 'badge badge-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low': return 'badge badge-success';
      case 'medium': return 'badge badge-warning';
      case 'high': return 'badge badge-danger';
      case 'urgent': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-4">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <div className="container py-4">
          <div className="alert alert-danger d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="ticket-detail-header">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline d-flex align-items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="card ticket-detail-card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h3 className="mb-1 font-semibold d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {ticket?.title}
              </h3>
              <p className="text-muted mb-0">Ticket #{ticket?._id?.substring(0, 8)}</p>
            </div>
            <div className="mt-2 mt-md-0 d-flex gap-2">
              <span className={`me-2 ${getStatusBadgeClass(ticket?.status)}`}>
                {ticket?.status}
              </span>
              <span className={getPriorityBadgeClass(ticket?.priority)}>
                {ticket?.priority}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-9">
                <h5 className="font-medium mb-3 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h5>
                <p className="mb-4">{ticket?.description}</p>
                
                <h5 className="font-medium mb-3 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments ({comments.length})
                </h5>
                <form onSubmit={handleAddComment} className="mb-4">
                  <div className="form-group">
                    <textarea
                      rows="4"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="form-control"
                      placeholder="Add a comment..."
                    />
                  </div>
                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="btn btn-primary d-flex align-items-center"
                    >
                      {commentLoading ? (
                        <>
                          <div className="spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Add Comment
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-4">
                  {comments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="empty-state-title">No comments yet</h3>
                      <p className="empty-state-description">Be the first to comment on this ticket.</p>
                    </div>
                  ) : (
                    <div>
                      {comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                          <div className="comment-header d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="bg-gray-200 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                <span className="text-sm font-medium text-gray-700">
                                  {comment.createdBy?.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h6 className="mb-0 font-medium">{comment.createdBy?.name}</h6>
                                <p className="text-muted mb-0 text-sm">{comment.createdBy?.email}</p>
                              </div>
                            </div>
                            <p className="text-muted mb-0 text-sm">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="comment-content mt-2 mb-0">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="font-medium mb-3 d-flex align-items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ticket Details
                    </h5>
                    <div className="mb-3">
                      <p className="text-muted mb-1 text-sm">Created By</p>
                      <div className="d-flex align-items-center">
                        <div className="bg-gray-200 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
                          <span className="text-xs font-medium text-gray-700">
                            {ticket?.createdBy?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="mb-0 font-medium">{ticket?.createdBy?.name}</p>
                          <p className="text-muted mb-0 text-sm">{ticket?.createdBy?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-muted mb-1 text-sm">Assigned To</p>
                      <div>
                        {ticket?.assignedTo ? (
                          <div className="d-flex align-items-center">
                            <div className="bg-gray-200 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
                              <span className="text-xs font-medium text-gray-700">
                                {ticket?.assignedTo?.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="mb-0 font-medium">{ticket?.assignedTo?.name}</p>
                              <p className="text-muted mb-0 text-sm">{ticket?.assignedTo?.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted">Unassigned</span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-muted mb-1 text-sm">Created At</p>
                      <p className="mb-0 font-medium">
                        {new Date(ticket?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;