import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'assign-ticket',
      title: 'Assign Ticket',
      description: 'Quickly assign an open ticket to an agent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      action: () => navigate('/tickets')
    },
    {
      id: 'escalate-ticket',
      title: 'Escalate Ticket',
      description: 'Mark a ticket as high priority or urgent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      action: () => navigate('/tickets')
    },
    {
      id: 'create-ticket',
      title: 'Create Ticket',
      description: 'Create a new ticket manually',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      action: () => navigate('/ticket/new')
    },
    {
      id: 'view-reports',
      title: 'View Reports',
      description: 'Access detailed analytics and reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      action: () => navigate('/tickets')
    }
  ];

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {actions.map(action => (
            <div 
              key={action.id} 
              className="quick-action-item"
              onClick={action.action}
            >
              <div className="quick-action-item__icon">
                {action.icon}
              </div>
              <div className="quick-action-item__content">
                <h4 className="quick-action-item__title">{action.title}</h4>
                <p className="quick-action-item__description">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;