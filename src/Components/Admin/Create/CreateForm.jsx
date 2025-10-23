// CreateForm.jsx

import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// The fa-icons import is correctly removed.
import ConfigView from './ConfigView';
import LayoutView from './LayoutView';
import "../../../Styles/CreateForm/Home.sass"
// IMPORTS for PNG icons
import date from "../../../assets/date.png"
import dropdown from "../../../assets/Dropdown.png"
import file from "../../../assets/fileupload.png"
import long from "../../../assets/longtext.png"
import short from "../../../assets/shorttext.png"
import number from "../../../assets/number.png"
import previewIcon from "../../../assets/Eye.png"

// Input fields available in palette (No Change)
const inputFields = [
    { label: "Short Text", icon: short },
    { label: "Long Text", icon: long }, 
    { label: "Date Picker", icon: date }, 
    { label: "Dropdown", icon: dropdown }, 
    { label: "File Upload", icon: file }, 
    { label: "Number", icon: number }, 
];

// Maximum limits (No Change)
const MAX_QUESTIONS = 10;

// Create new field with default values (No Change)
const createNewField = (field) => {
    const baseField = {
        ...field,
        id: Date.now() + Math.random(),
        question: "Untitled Question",
        description: "",
        showDescription: false,
        required: false,
    };

    switch (field.label) {
        case "Dropdown":
            return {
                ...baseField,
                options: [{ id: 1, value: "Option 1" }, { id: 2, value: "Option 2" }],
                selectionType: 'Single Select' 
            };
        case "File Upload":
            return {
                ...baseField,
                allowedFormats: ['PDF', 'PNG', 'JPG'],
                maxSizeMB: 2,
                allowMultiple: false 
            };
        case "Date Picker":
            return {
                ...baseField,
                dateFormat: 'DD/MM/YYYY' 
            };
        default:
            return baseField;
    }
};

// --- HELPER FUNCTIONS FOR LOCAL STORAGE (No Change) ---

const getLocalForms = () => {
    const formsJson = localStorage.getItem('forms');
    return formsJson ? JSON.parse(formsJson) : [];
};

const getFormById = (id) => {
    const forms = getLocalForms();
    return forms.find(f => f.id.toString() === id.toString());
};

const getCurrentDateString = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const CreateForm = () => {
    const { formId: urlFormId } = useParams();
    const location = useLocation();

    const [currentFormId] = useState(urlFormId || Date.now()); 
    
    // State initialization
    const [view, setView] = useState('config');
    const [formName, setFormName] = useState(''); 
    const [formDescription, setFormDescription] = useState('');
    
    const [HeaderName, setHeaderName] = useState(''); 
    const [HeaderDescription, setHeaderDescription] = useState('');
    const [formNameError, setFormNameError] = useState(false); 

    // 🌟 1. NEW STATE: Flag to make the component read-only (used for both 'View Form' and 'View Responses')
    const [isReadOnly, setIsReadOnly] = useState(false);
    
    const [draggedField, setDraggedField] = useState(null);
    const [formFields, setFormFields] = useState([]);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [activeFieldId, setActiveFieldId] = useState(null);

    const lastDragOverIndex = useRef(null);
    const navigate = useNavigate();

    // 🌟 2. EFFECT HOOK: Load form data and determine initial view/read-only status
    useEffect(() => {
        // Check the URL path to determine the mode
        const isViewingForm = location.pathname.startsWith('/view-form/');
        const isViewingResponses = location.pathname.startsWith('/view-responses/');
        const isNewOrDraft = location.pathname.startsWith('/create/');

        // Determine read-only status based on the route
        const shouldBeReadOnly = isViewingForm || isViewingResponses;
        setIsReadOnly(shouldBeReadOnly);

        if (urlFormId) {
            const existingForm = getFormById(urlFormId);
            if (existingForm) {
                setFormName(existingForm.title || ''); 
                setFormDescription(existingForm.formDes || '');
                setHeaderName(existingForm.HeaderName || existingForm.title || '');
                setHeaderDescription(existingForm.HeaderDescription || '');
                setFormFields(existingForm.formFields || []);
                
                // Set the initial view based on the URL path
                setView(isViewingResponses ? 'responses' : 'config'); 
            } else if (isNewOrDraft) {
                alert("Form not found. Starting a new form.");
                navigate('/create', { replace: true });
            }
        } else {
            // New form initialization (No Change)
            setFormName(''); 
            setHeaderName(''); 
            setFormDescription('');
            setHeaderDescription('');
            setFormFields([]);
            setView('config');
        }
    }, [urlFormId, navigate, location.pathname]);


    const saveFormToLocal = (status) => {
        const title = formName.trim() || 'Untitled Form';
        const formDes = formDescription.trim() || 'Description';
        
        const newForm = {
            id: currentFormId,
            title: title, 
            formDes:formDes,
            HeaderName: HeaderName.trim() || title, 
            status: status,
            HeaderDescription: HeaderDescription,
            formFields: formFields, 
            [status === 'published' ? 'publishedBy' : 'createdBy']: 'Current User', 
            [status === 'published' ? 'publishedDate' : 'createdDate']: getCurrentDateString(),
        };

        const forms = getLocalForms();
        const existingIndex = forms.findIndex(f => f.id.toString() === currentFormId.toString());

        if (existingIndex > -1) {
            forms[existingIndex] = { ...forms[existingIndex], ...newForm };
        } else {
            forms.unshift(newForm);
        }

        localStorage.setItem('forms', JSON.stringify(forms));
    };


    const handleSwitchToLayout = () => {
        // 🌟 Allow view switching even if form name is empty when in read-only mode
        if (!isReadOnly) {
            if (!formName.trim()) {
                setFormNameError(true);
                alert("Form Name is required to proceed to Layout.");
                return;
            }
        }
        setFormNameError(false); 

        if (!HeaderName.trim()) {
            setHeaderName(formName);
        }
        if (!HeaderDescription.trim()) {
            setHeaderDescription(formDescription);
        }

        setView('layout');
    };
    
    const handleFormNameChange = (value) => {
        if (isReadOnly) return; // Prevent change if read-only
        setFormName(value);
        if (formNameError) {
            setFormNameError(false);
        }
    };
    
    const handleSave = () => {
        if (isReadOnly) return; // Prevent action if read-only
        saveFormToLocal('draft');
        console.log(`Form '${formName}' saved as draft!`);
        navigate('/');
    };

    const handlePublish = () => {
        if (isReadOnly) return; // Prevent action if read-only
        if (formFields.length === 0) {
            alert("Please add at least one question before publishing.");
            return;
        }
        saveFormToLocal('published');
        console.log(`Form '${formName}' published!`);
        navigate('/'); 
    };

    const handlePreview = () => {
        if (isReadOnly) return; // Prevent action if read-only
        saveFormToLocal('draft');
        navigate(`/preview/${currentFormId}`);
    };

    // The remaining handlers (Drag/Drop/Field Management) should internally check isReadOnly
    // or be passed a disabled prop from LayoutView and ConfigView. For the purpose of 
    // keeping this file clean, we assume LayoutView/ConfigView will use the isReadOnly prop
    // passed below.
    const handleDragStart = (field) => {
        if (isReadOnly) return;
        setDraggedField(field);
        setActiveFieldId(null);
    };

    const handleDragEnd = () => {
        setDraggedField(null);
        setDragOverIndex(null);
        lastDragOverIndex.current = null;
    };

    const handleThrottledDragOver = (index) => {
        if (lastDragOverIndex.current !== index) {
            setDragOverIndex(index);
            lastDragOverIndex.current = index;
        }
    };

    const handleDrop = () => {
        if (isReadOnly) return;
        if (!draggedField) return;

        let newFields = [...formFields];
        const existingIndex = newFields.findIndex(f => f.id === draggedField.id);
        
        // ... (rest of drop logic remains the same)
        if (existingIndex === -1) {
            if (newFields.length < MAX_QUESTIONS) {
                const newField = createNewField(draggedField);
                const targetIndex = dragOverIndex !== null ? dragOverIndex : newFields.length;
                newFields.splice(targetIndex, 0, newField);
                setActiveFieldId(newField.id);
            }
        } else {
            newFields.splice(existingIndex, 1);
            const targetIndex = dragOverIndex !== null ? dragOverIndex : newFields.length;
            newFields.splice(targetIndex, 0, draggedField);
        }

        setFormFields(newFields);
        handleDragEnd();
    };

    // ... (Field Management Handlers - Assume internal checks/disabled state in LayoutView)

    const handleUpdateField = (id, updates) => {
        if (isReadOnly) return;
        setFormFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleDeleteField = (id) => {
        if (isReadOnly) return;
        setFormFields(prev => prev.filter(f => f.id !== id));
        if (activeFieldId === id) setActiveFieldId(null);
    };
    
    // ... (handleAddOption, handleUpdateOption, handleDeleteOption also need isReadOnly check, 
    // but leaving for brevity as the pattern is clear now)

    const handleAddOption = (fieldId) => {
        if (isReadOnly) return;
        setFormFields(prevFields => prevFields.map(field => {
            if (field.id === fieldId && field.options) {
                const newOptionId = field.options.length + 1;
                return {
                    ...field,
                    options: [...field.options, { id: newOptionId, value: `Option ${newOptionId}` }]
                };
            }
            return field;
        }));
    };

    // Handler for updating an existing option value
    const handleUpdateOption = (fieldId, optionId, newValue) => {
        if (isReadOnly) return;
        setFormFields(prevFields => prevFields.map(field => {
            if (field.id === fieldId && field.options) {
                return {
                    ...field,
                    options: field.options.map(option => 
                        option.id === optionId ? { ...option, value: newValue } : option
                    )
                };
            }
            return field;
        }));
    };

    // Handler for deleting an option from a Dropdown field
    const handleDeleteOption = (fieldId, optionId) => {
        if (isReadOnly) return;
        setFormFields(prevFields => prevFields.map(field => {
            if (field.id === fieldId && field.options) {
                if (field.options.length <= 1) {
                    alert("A Dropdown field must have at least one option.");
                    return field;
                }
                return {
                    ...field,
                    options: field.options.filter(option => option.id !== optionId)
                };
            }
            return field;
        }));
    };

    return (
        <div className="form-builder-page">
            <div className="form-tabs">
                <div className={`tab ${view === 'config' ? 'active' : ''}`} onClick={() => setView('config')}>
                    Form Configuration
                </div>
                <div className={`tab ${view === 'layout' ? 'active' : ''}`} onClick={handleSwitchToLayout}>
                    Form Layout
                </div>
                
                {/* 🌟 3. RESPONSES TAB: Only show if in read-only view mode */}
                {isReadOnly && (
                    <div 
                        className={`tab ${view === 'responses' ? 'active' : ''}`} 
                        onClick={() => setView('responses')}
                    >
                        Responses
                    </div>
                )}
            </div>

            {view === 'config' ? (
                <ConfigView
                    formName={formName}
                    setFormName={handleFormNameChange} 
                    formDescription={formDescription}
                    setFormDescription={setFormDescription}
                    isError={formNameError} 
                    isReadOnly={isReadOnly} 
                />
            ) : view === 'layout' ? (
                <LayoutView
                    inputFields={inputFields} 
                    formFields={formFields}
                    draggedField={draggedField}
                    dragOverIndex={dragOverIndex}
                    setDragOverIndex={handleThrottledDragOver}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    handleDrop={handleDrop}
                    activeFieldId={activeFieldId}
                    setActiveFieldId={setActiveFieldId}
                    handleUpdateField={handleUpdateField}
                    handleDeleteField={handleDeleteField}
                    handleAddOption={handleAddOption}
                    handleUpdateOption={handleUpdateOption}
                    handleDeleteOption={handleDeleteOption}
                    
                    HeaderName={HeaderName}
                    setHeaderName={setHeaderName}
                    HeaderDescription={HeaderDescription} 
                    setHeaderDescription={setHeaderDescription}
                    isReadOnly={isReadOnly} 
                />
            ) : ( // Responses View
                <div className="responses-view-container">
                    <h2>Responses for: {HeaderName || formName || 'Untitled Form'}</h2>
                    <p>This is the full-page content area for viewing form responses. (Currently mock content)</p>
                    {/* Add your actual ResponseList/Table component here */}
                </div>
            )}

            <div className="form-action-footer">
                {/* 🌟 4. HIDE ALL ACTIONS IF IN READ-ONLY MODE */}
                {!isReadOnly && view === 'layout' && (
                    <button className="preview-btn" onClick={handlePreview}>
                        <img src={previewIcon} alt="Preview" className="action-icon" /> 
                        Preview Form 
                    </button>
                )}
                
                {!isReadOnly && (
                    <>
                        <button 
                            className="save-draft-btn" 
                            onClick={handleSave} 
                        >
                            Save as draft
                        </button>
                        
                        {view === 'config' ? (
                            <button className="next-btn" onClick={handleSwitchToLayout} >Next</button> 
                        ) : (
                            <button className="next-btn publish-btn" onClick={handlePublish} disabled={!formName.trim()}>Publish Form</button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateForm;