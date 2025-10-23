import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Corrected path assuming FieldCard is a sibling component in the same directory, 
// and Layout/Styles are located outside the immediate project structure.
import FieldCard from './FieldCard'; 
import Layout from '../../Layout/Layout'; 
import "../../../Styles/CreateForm/Preview.sass"; 
 

// --- HELPER FUNCTIONS (Assuming these are available via import or context) ---
const getLocalForms = () => {
    const formsJson = localStorage.getItem('forms');
    return formsJson ? JSON.parse(formsJson) : [];
};

const getFormById = (id) => {
    const forms = getLocalForms();
    return forms.find(f => f.id.toString() === id.toString());
};
// ---------------------------------------------------------------------------------

const noop = () => {}; // A simple function to use for unused handlers

const Preview = () => {
    const { formId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 1. New state to hold user's answers in preview mode
    const [answers, setAnswers] = useState({});

    // 2. Initialize formData and answers state
    useEffect(() => {
        if (formId) {
            const form = getFormById(formId);
            if (form) {
                setFormData(form);
                
                // Initialize answers state with empty values for all fields
                const initialAnswers = form.formFields.reduce((acc, field) => {
                    acc[field.id] = ''; 
                    return acc;
                }, {});
                setAnswers(initialAnswers);

            } else {
                navigate('/', { replace: true });
            }
        }
        setLoading(false);
    }, [formId, navigate]);

    // 3. Handler to update the answers state when a user types/selects something
    const handleAnswerChange = (fieldId, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [fieldId]: value,
        }));
    };

    // 4. Handler to clear all inputs
    const handleClearForm = () => {
        if (!formData) return;
        
        // Reset answers to an empty object, forcing FieldCard inputs to clear
        const clearedAnswers = formData.formFields.reduce((acc, field) => {
            acc[field.id] = ''; 
            return acc;
        }, {});
        setAnswers(clearedAnswers);
    };

    const isEditorPreview = location.pathname.includes('/preview/');
    const headerTitle = formData?.title || 'Untitled Form'; 
    const cardTitle = formData?.HeaderName || headerTitle;
    
    if (loading || !formData) {
        return (
            <Layout pageTitleOverride={headerTitle}>
                <div className="loading-state">Loading Preview...</div>
            </Layout>
        );
    }
    
    return (
        <Layout pageTitleOverride={headerTitle}>
            <div className="form-preview-page"> 
                
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
                                
                                // 🛑 CRITICAL: Pass no-op functions for all editor/builder related props
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

                                // Critical flag to enable functional look, disabled interaction
                                isPreviewMode={true} 

                                // 🔑 NEW: Props to manage user input in Preview Mode
                                answerValue={answers[field.id] || ''} 
                                handleAnswerChange={handleAnswerChange}
                            />
                        ))}
                    </div>
                </div>

                {/* --- FIXED FOOTER --- */}
                <div className="form-submit-footer">
                    {/* 5. Attach the clear handler to the button */}
                    <button 
                        className="clear-form-btn"
                        onClick={handleClearForm}
                    >
                        Clear Form
                    </button>
                    
                    {/* The Submit button is only rendered if it is NOT the Editor Preview */}
                    {!isEditorPreview && (
                        <button className="submit-form-btn">Submit</button> 
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Preview;
