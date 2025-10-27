// CreateForm.jsx

import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// The fa-icons import is correctly removed.
import ConfigView from './ConfigView';
import LayoutView from './LayoutView';
import ResponseView from './ResponseView';
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
    const [formVisibility, setFormVisibility] = useState(false);
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

                setFormVisibility(existingForm.formVisibility || false);
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
            setFormVisibility(false);
            setFormFields([]);
            setView('config');
        }
    }, [urlFormId, navigate, location.pathname]);


    const saveFormToLocal = (status,formVisibility) => {
        const title = formName.trim() || 'Untitled Form';
        const formDes = formDescription.trim() || 'Description';
        const newForm = {
            id: currentFormId,
            title: title, 
            formDes:formDes,
            HeaderName: HeaderName.trim() || title, 
            status: status,
            formVisibility: formVisibility,
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
        saveFormToLocal('draft');
        console.log(`Form '${formName}' saved as draft!`);
        navigate('/');
    };

    const handleSaveVisibility = () => {
        if (!currentFormId) return; 

        const existingForm = getFormById(currentFormId);
        if (!existingForm) return;

        // Use the existing form status (draft or published)
        // and the NEW formVisibility state from the toggle
        let forms = getLocalForms();
        const updatedForms = forms.map(form => 
            form.id.toString() === existingForm.id.toString()
                ? { ...form, formVisibility: formVisibility } 
                : form
        );
        localStorage.setItem('forms', JSON.stringify(updatedForms));
        navigate('/');

        console.log(`Form visibility updated to: ${formVisibility ? 'ON' : 'OFF'}`);
        
    };

    const handlePublish = () => {
        if(formVisibility){console.log("lool")}    

        if (isReadOnly) return; // Prevent action if read-only
        if (formFields.length === 0) {
            alert("Please add at least one question before publishing.");
            return;
        }
        saveFormToLocal('published',formVisibility);
        console.log(`Form '${formName}' published!`);
        navigate('/'); 
    };

    const handlePreview = () => {
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

    const handleCopyField = (id) => {
        if (isReadOnly) return;

        if (formFields.length >= MAX_QUESTIONS) {
            alert(`Maximum number of questions (${MAX_QUESTIONS}) reached.`);
            return;
        }

        const indexToCopy = formFields.findIndex(f => f.id === id);
        if (indexToCopy === -1) return;

        const originalField = formFields[indexToCopy];
        
        // Deep copy the field to ensure no shared references, especially for array/object properties like 'options'
        const copiedField = JSON.parse(JSON.stringify(originalField));

        // Assign a new unique ID to the copy
        copiedField.id = Date.now() + Math.random();
        
        // Optional: Prepend a phrase to the question to indicate it's a copy
        copiedField.question = originalField.question;

        const newFields = [...formFields];
        // Insert the copy immediately after the original field
        newFields.splice(indexToCopy + 1, 0, copiedField);

        setFormFields(newFields);
        setActiveFieldId(copiedField.id); // Make the new copy active
    };


    const handleViewResponse = (responseId) => {
    // Logic to open a response viewer modal or page
    navigate(`/form/${currentFormId}/view-response/${responseId}`);
    
    };

    const handleExport = (viewMode) => {
        // Logic to trigger the Excel export based on the current view mode
        console.log(`Exporting data for view: ${viewMode}`);
        alert(`Exporting ${viewMode} data to Excel...`);
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
                    formVisibility={formVisibility}
                    setFormVisibility={setFormVisibility}
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
                    handleCopyField={handleCopyField}
                    HeaderName={HeaderName}
                    setHeaderName={setHeaderName}
                    HeaderDescription={HeaderDescription} 
                    setHeaderDescription={setHeaderDescription}
                    isReadOnly={isReadOnly} 
                />
            ) : ( // Responses View
                <div className="responses-view-container">
                    <ResponseView // <--- NEW COMPONENT USAGE
                        formId={urlFormId || currentFormId}
                        formName={HeaderName || formName || 'Untitled Form'}
                        onViewResponse={handleViewResponse}
                        onExport={handleExport}
                    />
                </div>
            )}

            <div className="form-action-footer">
                {/* 🌟 4. HIDE ALL ACTIONS IF IN READ-ONLY MODE */}
                {(
                    (!isReadOnly && view === 'layout') || 
                    (isReadOnly)             
                ) && (
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
                {isReadOnly && (
                
                      <>
                      <button 
                            className="save-draft-btn" 
                            onClick={handleSaveVisibility} 
                        >
                            Save
                        </button></>
                )}
            </div>
        </div>
    );
};

export default CreateForm;