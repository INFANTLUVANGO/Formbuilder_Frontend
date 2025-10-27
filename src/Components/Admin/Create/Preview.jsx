import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import FieldCard from './FieldCard'; 
import Layout from '../../Layout/Layout'; 
import "../../../Styles/CreateForm/Preview.sass"; 

// --- HELPER FUNCTIONS (UNCHANGED) ---

const getLocalForms = () => {
 const formsJson = localStorage.getItem('forms');
 return formsJson ? JSON.parse(formsJson) : [];
};

const getFormById = (id) => {
 const forms = getLocalForms();
 return forms.find(f => f.id.toString() === id.toString());
};

// 🔑 MOCK: Function to fetch submitted answers
const getSubmissionAnswers = (submissionId) => {
  console.log(`MOCK: Loading answers for submission ${submissionId}`);
  
  // 🚨 IMPORTANT: Replace this with your actual API call.
  return {
    'field-1': 'The first saved response.',
    'field-2': { name: 'My_Uploaded_Doc.pdf', url: '/api/download/...' }, 
    'field-3': '2025-01-01',
  };
};

// 🔑 MOCK: Submission function (Simulates API call)
const mockSubmitForm = (formId, answers) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success 90% of the time
            if (Math.random() < 0.9) {
                console.log(`MOCK SUBMISSION SUCCESS for Form ${formId}:`, answers);
                // In a real app, this would return the new submission ID
                resolve({ success: true, submissionId: Date.now() }); 
            } else {
                console.error(`MOCK SUBMISSION FAILURE for Form ${formId}`);
                reject(new Error("Failed to connect to the server. Please try again."));
            }
        }, 1500);
    });
};
// ---------------------------------------------------------------------------------

const noop = () => {}; 

const Preview = () => {
 const { formId, responseId } = useParams(); 
 const navigate = useNavigate();
 const location = useLocation(); 

 const [formData, setFormData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [answers, setAnswers] = useState({});
 
 // 🌟 NEW STATE for Submission Feedback & Status
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [submissionError, setSubmissionError] = useState(null);
 const [submissionSuccess, setSubmissionSuccess] = useState(false);
 const [validationErrors, setValidationErrors] = useState({}); // Stores validation errors by fieldId

 const isEditorPreview = location.pathname.includes('/preview/');
 const isLearnerSubmission = location.pathname.includes('/submit/');
 const isViewSubmission = !!responseId && location.pathname.includes('/view-response/');


 // 2. Initialize formData and answers state
 useEffect(() => {
      if (!formId) {
      navigate('/', { replace: true });
      return;
      }

      const form = getFormById(formId);
      

      if (!form) {
            // navigate('/', { replace: true }); // ❌ COMMENTED OUT: THIS IS THE FIX
            console.error(`Form with ID ${formId} not found in local storage.`);
            setLoading(false); // Still stop loading, but don't redirect
            return;
        }

      setFormData(form);

      // --- ANSWER LOADING LOGIC ---
      let initialAnswers = {};
      if (isViewSubmission) {
        // MODE 3: Load existing answers for viewing
        initialAnswers = getSubmissionAnswers(responseId); 
      } else {
        // MODE 1 & 2: Initialize empty state for input/testing
        initialAnswers = form.formFields.reduce((acc, field) => {
          acc[field.id] = ''; 
          return acc;
        }, {});
      }
      setAnswers(initialAnswers);
    
      setLoading(false);
  
 }, [formId, responseId, isViewSubmission, navigate]); 

 // 3. Handler to update the answers state
 const handleAnswerChange = (fieldId, value) => {
    if (!isViewSubmission) {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [fieldId]: value,
      }));
            // Clear specific validation error on change
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
    }
 };

 // 4. Handler to clear all inputs
 const handleClearForm = () => {
    if (!formData) return;
    
    const clearedAnswers = formData.formFields.reduce((acc, field) => {
    acc[field.id] = ''; 
    return acc;
    }, {});
    setAnswers(clearedAnswers);
      setValidationErrors({}); // Also clear validation errors
      setSubmissionError(null);
 };
  
 // 🌟 5. NEW: Validation and Submission Handler
 const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!isLearnerSubmission || isSubmitting || submissionSuccess) return;

        setSubmissionError(null);
        setValidationErrors({});
        
        const errors = {};
        const fields = formData.formFields || [];

        // --- Client-Side Validation ---
        fields.forEach(field => {
            if (field.isRequired && !answers[field.id]) {
                // Special check for file upload: value might be an empty object/null
                if (field.fieldType === 'file' && (!answers[field.id] || !answers[field.id].name)) {
                    errors[field.id] = 'This field is required.';
                } else if (field.fieldType !== 'file' && answers[field.id].trim() === '') {
                    errors[field.id] = 'This field is required.';
                }
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setSubmissionError("Please correct the errors in the form before submitting.");
            // Scroll to the first error
            const firstErrorFieldId = Object.keys(errors)[0];
            document.getElementById(`field-card-${firstErrorFieldId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // --- Submission Logic ---
        setIsSubmitting(true);
        try {
            await mockSubmitForm(formId, answers);
            setSubmissionSuccess(true);
            // Optionally redirect after a delay
            setTimeout(() => navigate('/learner/forms', { replace: true }), 3000); 
        } catch (error) {
            setSubmissionError(error.message || "An unexpected error occurred during submission.");
        } finally {
            setIsSubmitting(false);
        }
    };


 const headerTitle = formData?.title || 'Untitled Form'; 
 const cardTitle = formData?.HeaderName || headerTitle;
 
 if (loading || !formData) {
    return (
    <Layout pageTitleOverride={headerTitle}>
      <div className="loading-state">Loading Form...</div>
    </Layout>
    );
 }
 
 return (
  <Layout pageTitleOverride={headerTitle} >
      <div className={`form-preview-page ${isViewSubmission ? 'submission-view-mode' : ''}`}> 
        
        <div className="form-preview-wrapper"> 
        
          <div className="form-info-card">
            <h2 className="info-card-name">{cardTitle}</h2>
            <p className="info-card-description">{formData.HeaderDescription}</p>
          </div>

                {/* 🌟 NEW: Submission Feedback */}
                {submissionError && (
                    <div className="submission-message error">
                        <p>{submissionError}</p>
                    </div>
                )}
                {submissionSuccess && (
                    <div className="submission-message success">
                        <p>✅ Form submitted successfully! Redirecting you shortly...</p>
                    </div>
                )}
        
          <div className="form-questions-list">
              {formData.formFields.map((field, index) => (
              <FieldCard
                key={field.id} 
                          id={`field-card-${field.id}`} // Used for scrolling to errors
                field={field}
                index={index}
                
                // 🛑 Editor/Builder related props (unchanged)
                activeFieldId={null} 
                setActiveFieldId={noop} 
                          handleUpdateField={noop} 
                // ... (other noop props)
                          isLearnerSubmission={isLearnerSubmission} 
                isViewSubmission={isViewSubmission} 
                isEditorPreview={isEditorPreview}

                // 🔑 Answer props
                answerValue={answers[field.id] || ''} 
                handleAnswerChange={handleAnswerChange}
                          
                          // 🌟 NEW: Validation prop
                          validationError={validationErrors[field.id]}
              />
              ))}
            </div>
        </div>

        {/* --- FIXED FOOTER: Conditional Rendering for Modes --- */}
        <div className="form-submit-footer">
        
              {/* MODE 3: View Responses */}
              {isViewSubmission && (
                <button 
                  className="submit-form-btn primary-action"
                  onClick={() => navigate(-1)} 
                >
                  Back to Responses
                </button>
              )}

              {/* MODES 1 & 2: Interactive (Preview or Submission) */}
              {!isViewSubmission && (
                <>
                  <button 
                    className="clear-form-btn"
                    onClick={handleClearForm}
                    disabled={isSubmitting || submissionSuccess}
                  >
                    Clear Form
                  </button>
                  
                  {/* Submit button only for the actual Learner Submission mode */}
                  {isLearnerSubmission && (
                    <button 
                          className={`submit-form-btn ${isSubmitting ? 'loading' : ''}`}
                          onClick={handleSubmitForm}
                          disabled={isSubmitting || submissionSuccess}
                      >
                          {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button> 
                  )}
                </>
              )}
        </div>
      </div>
  </Layout>
 );
};

export default Preview; 