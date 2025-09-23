import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { title, description, priority } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/tickets', { title, description, priority });
      if (response.data._id) {
        navigate(`/ticket/${response.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket">
      <Navbar />
      <div className="container create-ticket__container">
        <div className="create-ticket__header">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn--outline create-ticket__back-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon create-ticket__back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="card create-ticket__card">
          <div className="card__header">
            <h3 className="card__title">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon create-ticket__title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Ticket
            </h3>
          </div>
          <div className="card__body">
            {error && (
              <div className="alert alert--danger create-ticket__error">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon alert__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="create-ticket__form">
              <div className="form-group create-ticket__form-group">
                <label htmlFor="title" className="form-label create-ticket__label">Title</label>
                <input
                  type="text"
                  className="form-control create-ticket__input"
                  id="title"
                  name="title"
                  value={title}
                  onChange={onChange}
                  required
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="form-group create-ticket__form-group">
                <label htmlFor="description" className="form-label create-ticket__label">Description</label>
                <textarea
                  className="form-control create-ticket__textarea"
                  id="description"
                  name="description"
                  rows="6"
                  value={description}
                  onChange={onChange}
                  required
                  placeholder="Provide detailed information about the issue..."
                ></textarea>
              </div>

              <div className="form-group create-ticket__form-group">
                <label htmlFor="priority" className="form-label create-ticket__label">Priority</label>
                <select
                  className="form-control create-ticket__select"
                  id="priority"
                  name="priority"
                  value={priority}
                  onChange={onChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="create-ticket__actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn--outline create-ticket__cancel-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon create-ticket__cancel-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary create-ticket__submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner spinner--small" style={{ width: '1rem', height: '1rem' }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon create-ticket__submit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Create Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;