import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CompanySignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    billingEmail: '',
    contactEmail: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerPasswordConfirm: ''
  });
  
  const [availabilityCheck, setAvailabilityCheck] = useState({
    subdomain: null,
    checking: false
  });
  
  const [setupInfo, setSetupInfo] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch setup info on component mount
  useEffect(() => {
    const fetchSetupInfo = async () => {
      try {
        const response = await api.get('/companies/setup-info');
        setSetupInfo(response.data);
      } catch (error) {
        console.error('Error fetching setup info:', error);
      }
    };

    fetchSetupInfo();
  }, []);

  // Handle subdomain availability check with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.subdomain.length >= 3) {
        checkSubdomainAvailability(formData.subdomain);
      } else {
        setAvailabilityCheck({ subdomain: null, checking: false });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formData.subdomain]);

  const checkSubdomainAvailability = async (subdomain) => {
    setAvailabilityCheck({ ...availabilityCheck, checking: true });
    try {
      const response = await api.get(`/companies/check-subdomain/${subdomain}`);
      setAvailabilityCheck({ subdomain: response.data.available, checking: false });
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      setAvailabilityCheck({ subdomain: false, checking: false });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-update subdomain based on company name if user hasn't manually changed it
    if (name === 'name' && !formData.subdomain) {
      const autoSubdomain = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        subdomain: autoSubdomain
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Billing email is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Owner email is required';
    if (!formData.ownerPassword) newErrors.ownerPassword = 'Password is required';
    if (!formData.ownerPasswordConfirm) newErrors.ownerPasswordConfirm = 'Please confirm password';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.billingEmail && !emailRegex.test(formData.billingEmail)) {
      newErrors.billingEmail = 'Please enter a valid billing email';
    }
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid contact email';
    }
    if (formData.ownerEmail && !emailRegex.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid owner email';
    }

    // Password confirmation
    if (formData.ownerPassword !== formData.ownerPasswordConfirm) {
      newErrors.ownerPasswordConfirm = 'Passwords do not match';
    }

    // Password strength
    if (formData.ownerPassword && formData.ownerPassword.length < 6) {
      newErrors.ownerPassword = 'Password must be at least 6 characters';
    }

    // Subdomain validation
    if (formData.subdomain) {
      const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
      if (!subdomainRegex.test(formData.subdomain) || formData.subdomain.length < 3) {
        newErrors.subdomain = 'Subdomain must be 3+ characters and contain only lowercase letters, numbers, and hyphens';
      } else if (!availabilityCheck.subdomain) {
        newErrors.subdomain = 'Subdomain is not available';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/companies', {
        ...formData,
        plan: selectedPlan
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set success and redirect after delay
      setSuccess(true);
      
      // Redirect to company dashboard after showing success message
      setTimeout(() => {
        // Redirect to company dashboard or main app
        window.location.href = `https://${response.data.company.subdomain}.${window.location.hostname}`;
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during signup';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getPlanFeatures = (planKey) => {
    if (!setupInfo || !setupInfo.plans[planKey]) return null;
    return setupInfo.plans[planKey];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Company Created Successfully!
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                You will be redirected to your company dashboard shortly...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Support Panel</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create Your Company Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Get started with your own support panel in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Your Plan</h3>
                
                {setupInfo && Object.entries(setupInfo.plans).map(([key, plan]) => (
                  <div 
                    key={key}
                    className={`border rounded-lg p-4 mb-3 cursor-pointer transition-colors ${
                      selectedPlan === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{plan.name}</h4>
                        <p className="text-2xl font-bold text-gray-900">
                          ${plan.price}
                          {plan.price > 0 && <span className="text-sm font-normal text-gray-500">/month</span>}
                        </p>
                      </div>
                      {selectedPlan === key && (
                        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-gray-600">
                      <li>{plan.features.agentSeats} agent{plan.features.agentSeats !== 1 ? 's' : ''}</li>
                      <li>{plan.features.ticketVolume} tickets/month</li>
                      {plan.features.customFields && <li>Custom fields</li>}
                      {plan.features.reporting && <li>Advanced reporting</li>}
                      {plan.features.apiAccess && <li>API access</li>}
                      {plan.features.customBranding && <li>Custom branding</li>}
                    </ul>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">What's included in all plans:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Unlimited tickets</li>
                    <li>• Email support</li>
                    <li>• Basic reporting</li>
                    <li>• Knowledge base</li>
                    <li>• Mobile app</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                {errors.general && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                      Subdomain
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        id="subdomain"
                        name="subdomain"
                        type="text"
                        value={formData.subdomain}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.subdomain ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">.{window.location.hostname.replace('www.', '')}</span>
                      </div>
                      {availabilityCheck.checking && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                    {errors.subdomain && <p className="mt-1 text-sm text-red-600">{errors.subdomain}</p>}
                    {availabilityCheck.subdomain === true && (
                      <p className="mt-1 text-sm text-green-600">✓ This subdomain is available</p>
                    )}
                    {availabilityCheck.subdomain === false && formData.subdomain && availabilityCheck.subdomain !== null && !errors.subdomain && (
                      <p className="mt-1 text-sm text-red-600">This subdomain is not available</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700">
                        Billing Email
                      </label>
                      <div className="mt-1">
                        <input
                          id="billingEmail"
                          name="billingEmail"
                          type="email"
                          value={formData.billingEmail}
                          onChange={handleChange}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.billingEmail ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.billingEmail && <p className="mt-1 text-sm text-red-600">{errors.billingEmail}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Contact Email
                      </label>
                      <div className="mt-1">
                        <input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                      Owner Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="ownerName"
                        name="ownerName"
                        type="text"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.ownerName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">
                      Owner Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="ownerEmail"
                        name="ownerEmail"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.ownerEmail ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {errors.ownerEmail && <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ownerPassword" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1">
                        <input
                          id="ownerPassword"
                          name="ownerPassword"
                          type="password"
                          value={formData.ownerPassword}
                          onChange={handleChange}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.ownerPassword ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.ownerPassword && <p className="mt-1 text-sm text-red-600">{errors.ownerPassword}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ownerPasswordConfirm" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="mt-1">
                        <input
                          id="ownerPasswordConfirm"
                          name="ownerPasswordConfirm"
                          type="password"
                          value={formData.ownerPasswordConfirm}
                          onChange={handleChange}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.ownerPasswordConfirm ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {errors.ownerPasswordConfirm && <p className="mt-1 text-sm text-red-600">{errors.ownerPasswordConfirm}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Company...
                        </>
                      ) : (
                        `Create Company${selectedPlan !== 'free' ? ` - $${getPlanFeatures(selectedPlan)?.price}/month` : ''}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;