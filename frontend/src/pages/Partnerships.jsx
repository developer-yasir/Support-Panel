import { useState, useEffect } from 'react';
import { api } from '../services/api';

const Partnerships = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [requests, setRequests] = useState([]);
  const [partnerCompanies, setPartnerCompanies] = useState([]);
  const [partnerAgents, setPartnerAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [requestForm, setRequestForm] = useState({
    requestedCompanyId: '',
    accessLevel: 'contacts',
    partnershipName: '',
    partnershipDescription: ''
  });

  // Load existing partnerships and pending requests
  useEffect(() => {
    const fetchPartnershipData = async () => {
      try {
        const [partnershipsRes, requestsRes, companiesRes, agentsRes] = await Promise.all([
          api.get('/partnerships'),
          api.get('/partnerships/requests'),
          api.get('/partnerships/companies'),
          api.get('/partnerships/agents')
        ]);

        setPartnerships(partnershipsRes.data);
        setRequests(requestsRes.data);
        setPartnerCompanies(companiesRes.data);
        setPartnerAgents(agentsRes.data);
      } catch (err) {
        setError('Failed to load partnership data');
        console.error('Error loading partnership data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnershipData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/partnerships', requestForm);
      setPartnerships([...partnerships, response.data]);
      setRequestForm({
        requestedCompanyId: '',
        accessLevel: 'contacts',
        partnershipName: '',
        partnershipDescription: ''
      });
    } catch (err) {
      setError('Failed to create partnership request');
      console.error('Error creating partnership request:', err);
    }
  };

  const handleApproveRequest = async (partnershipId) => {
    try {
      const response = await api.put(`/partnerships/${partnershipId}`);
      setPartnerships([...partnerships, response.data]);
      setRequests(requests.filter(req => req._id !== partnershipId));
    } catch (err) {
      setError('Failed to approve partnership request');
      console.error('Error approving partnership request:', err);
    }
  };

  const handleRejectRequest = async (partnershipId) => {
    try {
      await api.put(`/partnerships/${partnershipId}/reject`);
      setRequests(requests.filter(req => req._id !== partnershipId));
    } catch (err) {
      setError('Failed to reject partnership request');
      console.error('Error rejecting partnership request:', err);
    }
  };

  const handleCancelPartnership = async (partnershipId) => {
    try {
      await api.delete(`/partnerships/${partnershipId}`);
      setPartnerships(partnerships.filter(p => p._id !== partnershipId));
    } catch (err) {
      setError('Failed to cancel partnership');
      console.error('Error canceling partnership:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading partnerships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Partnerships</h1>
        <p className="text-gray-600">
          Connect with other companies to collaborate on tickets and share resources
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Partnership Request Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Partnership</h2>
        <form onSubmit={handleCreateRequest}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner Company *
              </label>
              <select
                value={requestForm.requestedCompanyId}
                onChange={(e) => setRequestForm({...requestForm, requestedCompanyId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a company</option>
                {partnerCompanies.map(company => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level *
              </label>
              <select
                value={requestForm.accessLevel}
                onChange={(e) => setRequestForm({...requestForm, accessLevel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="contacts">Contacts Only</option>
                <option value="agents">Contacts + Agents</option>
                <option value="tickets">Contacts + Agents + Tickets</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partnership Name
            </label>
            <input
              type="text"
              value={requestForm.partnershipName}
              onChange={(e) => setRequestForm({...requestForm, partnershipName: e.target.value})}
              placeholder="e.g. Main Supplier, Key Partner"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={requestForm.partnershipDescription}
              onChange={(e) => setRequestForm({...requestForm, partnershipDescription: e.target.value})}
              placeholder="Describe the purpose of this partnership"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Send Partnership Request
          </button>
        </form>
      </div>

      {/* Pending Requests */}
      {requests.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Partnership Requests</h2>
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {request.requestingCompanyId.name} wants to partner
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Access level: {request.accessLevel} | Sent: {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                    {request.partnershipName && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Name:</strong> {request.partnershipName}
                      </p>
                    )}
                    {request.partnershipDescription && (
                      <p className="text-sm text-gray-600 mt-1">
                        {request.partnershipDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveRequest(request._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Partnerships */}
      {partnerships.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Partnerships</h2>
          <div className="space-y-4">
            {partnerships.map(partnership => {
              // For now, just use the requestedCompanyId as the partner, but we should
              // improve this in the backend to return only the partner company info
              const partnerCompany = partnership.requestingCompanyId._id !== partnership.requestingCompanyId
                ? partnership.requestingCompanyId
                : partnership.requestedCompanyId;

              return (
                <div key={partnership._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {partnerCompany && partnerCompany.name ? partnerCompany.name : 'Partner Company'}
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {partnership.accessLevel} access
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Established: {new Date(partnership.approvedAt).toLocaleDateString()}
                      </p>
                      {partnership.partnershipName && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Name:</strong> {partnership.partnershipName}
                        </p>
                      )}
                      {partnership.partnershipDescription && (
                        <p className="text-sm text-gray-600 mt-1">
                          {partnership.partnershipDescription}
                        </p>
                      )}
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Permissions:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {partnership.permissions.canSeeAgents && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              See Agents
                            </span>
                          )}
                          {partnership.permissions.canAssignTickets && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Assign Tickets
                            </span>
                          )}
                          {partnership.permissions.canViewTickets && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              View Tickets
                            </span>
                          )}
                          {partnership.permissions.canContactAgents && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Contact Agents
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelPartnership(partnership._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {partnerships.length === 0 && requests.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No partnerships yet</h3>
          <p className="text-gray-600">
            Start by requesting a partnership with another company or wait for incoming requests.
          </p>
        </div>
      )}
    </div>
  );
};

export default Partnerships;