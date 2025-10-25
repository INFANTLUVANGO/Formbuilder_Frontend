import React, { useState, useEffect } from 'react';
// 🔑 Import useLocation for path checks
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import FieldCard from './FieldCard'; 
import Layout from '../../Layout/Layout'; 
import "../../../Styles/CreateForm/Preview.sass"; 

// --- HELPER FUNCTIONS ---

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
    // The file answer must be an object containing the name and a download URL.
    return {
        'field-1': 'The first saved response.',
        'field-2': { name: 'My_Uploaded_Doc.pdf', url: `/api/download/${submissionId}/field-2` }, // File answer format
        'field-3': '2025-01-01',
        // Use field.id keys from your formFields
    };
};
// ---------------------------------------------------------------------------------

const noop = () => {}; 

const Preview = () => {
    // 🔑 Destructure submissionId (optional parameter from the view-response route)
  const { formId, responseId } = useParams(); 
  const navigate = useNavigate();
    const location = useLocation(); // 🔑 Get current path for mode checks

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [answers, setAnswers] = useState({});

    // 🔑 Define the three modes based on the URL path
  const isEditorPreview = location.pathname.includes('/preview/');
  const isLearnerSubmission = location.pathname.includes('/submit/');
    // If submissionId exists AND we are on the view-response route
    const isViewSubmission = !!responseId && location.pathname.includes('/view-response/');

  // 2. Initialize formData and answers state
  useEffect(() => {
    if (!formId) {
      navigate('/', { replace: true });
            return;
    }

        const form = getFormById(formId);
        if (!form) {
            navigate('/', { replace: true });
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
    
    // Add dependencies for correct re-run when submissionId or route changes
  }, [formId, responseId, isViewSubmission, navigate]); 

  // 3. Handler to update the answers state when a user types/selects something
  const handleAnswerChange = (fieldId, value) => {
        // 🔑 Only allow input if NOT in View Submission mode
        if (!isViewSubmission) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [fieldId]: value,
            }));
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
            {/* Conditional class for styling in view-only mode */}
      <div className={`form-preview-page ${isViewSubmission ? 'submission-view-mode' : ''}`}> 
        
        <div className="form-preview-wrapper"> 
          
          <div className="form-info-card">
            <h2 className="info-card-name">{cardTitle}</h2>
            <p className="info-card-description">{formData.HeaderDescription}</p>
          </div>
          
          <div className="form-questions-list">
                {formData.formFields.map((field, index) => (
                <FieldCard
                    key={field.id} 
                    field={field}
                    index={index}
                    
                    // 🛑 Pass no-op functions for all editor/builder related props
                    activeFieldId={null} 
                    setActiveFieldId={noop} 
                    handleUpdateField={noop} 
                    handleDeleteField={noop} 
                    handleDragStart={noop} 
                    handleDragEnd={noop} 
                    setDragOverIndex={noop}
                    handleCopyField={noop} 
                    handleAddOption={noop}
                    handleUpdateOption={noop}
                    handleDeleteOption={noop}
                    isPreviewMode={isEditorPreview} // Editor's Test Preview
                    isLearnerSubmission={isLearnerSubmission} // Learner's live form
                    isViewSubmission={isViewSubmission} // View Responses (Read-Only)

                    // 🔑 Answer props
                    answerValue={answers[field.id] || ''} 
                    handleAnswerChange={handleAnswerChange}
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
                            onClick={() => navigate(-1)} // Go back to the responses list
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
                            >
                                Clear Form
                            </button>
                            
                            {/* Submit button only for the actual Learner Submission mode */}
                            {isLearnerSubmission && (
                                <button className="submit-form-btn">Submit</button> 
                            )}
                        </>
                    )}
        </div>
      </div>
    </Layout>
  );
};

export default Preview;
