import React, { useState, useRef, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { FaCalendarAlt, FaFile, FaList, FaSortNumericUp, FaStream, FaPencilAlt, FaPlusCircle } from 'react-icons/fa'; 
import ConfigView from './ConfigView';
import LayoutView from './LayoutView';
import "../../../Styles/CreateForm/Home.sass"

// Input fields available in palette (No change)
const inputFields = [
    { label: "Short Text", icon: FaPencilAlt },
    { label: "Long Text", icon: FaStream },
    { label: "Date Picker", icon: FaCalendarAlt },
    { label: "Dropdown", icon: FaList },
    { label: "File Upload", icon: FaFile },
    { label: "Number", icon: FaSortNumericUp },
];

// Maximum limits (No change)
const MAX_QUESTIONS = 10;

// Create new field with default values (No change)
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

// --- HELPER FUNCTIONS FOR LOCAL STORAGE ---

const getLocalForms = () => {
    const formsJson = localStorage.getItem('forms');
    return formsJson ? JSON.parse(formsJson) : [];
};

// NEW: Function to find a specific form by ID, handling string/number types
const getFormById = (id) => {
    const forms = getLocalForms();
    // CRITICAL: Use toString() for comparison as URL params are strings
    return forms.find(f => f.id.toString() === id.toString());
};

const getCurrentDateString = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const CreateForm = () => {
    const { formId: urlFormId } = useParams();

    const [currentFormId] = useState(urlFormId || Date.now()); 
    
    // State initialization
    const [view, setView] = useState('config');
    const [formName, setFormName] = useState(''); // Internal Form Name (Config Tab)
    const [formDescription, setFormDescription] = useState('');
    
    const [HeaderName, setHeaderName] = useState(''); 
    const [HeaderDescription, setHeaderDescription] = useState('');
    const [formNameError, setFormNameError] = useState(false); // 🎯 NEW: State for error indication

    const [draggedField, setDraggedField] = useState(null);
    const [formFields, setFormFields] = useState([]);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [activeFieldId, setActiveFieldId] = useState(null);

    const lastDragOverIndex = useRef(null);
    const navigate = useNavigate();

    // 3. EFFECT HOOK TO LOAD FORM DATA FOR EDITING
    useEffect(() => {
        if (urlFormId) {
            const existingForm = getFormById(urlFormId);
            if (existingForm) {
                // Prefill state with loaded data (EDIT MODE)
                setFormName(existingForm.title || ''); // Should still load saved data
                setFormDescription(existingForm.formDescription || '');
                setHeaderName(existingForm.HeaderName || existingForm.title || '');
                setFormFields(existingForm.formFields || []);
                setView('config'); 
            } else {
                alert("Form not found. Starting a new form.");
                navigate('/create', { replace: true });
            }
        } else {
            // Set defaults for a brand new form (CREATE MODE)
            // 🎯 We now use '' and rely on placeholders for a cleaner initial state
            setFormName(''); 
            setHeaderName(''); 
            setFormDescription('');
            setFormFields([]);
            setView('config');
        }
    }, [urlFormId, navigate]); 

    // Helper to save or update the form array in local storage
    const saveFormToLocal = (status) => {
        const title = formName.trim() || 'Untitled Form';
        const formDes = formDescription.trim() || 'Description';
        
        const newForm = {
            id: currentFormId,
            title: title, 
            formDes:formDes,
            HeaderName: HeaderName.trim() || title, // Display Name (defaults to internal title)
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
        if (!formName.trim()) {
            // CHECK: If Form Name is empty, set error state and stop.
            setFormNameError(true);
            alert("Form Name is required to proceed to Layout.");
            return;
        }

        // Success: Reset error state
        setFormNameError(false); 

        // Set HeaderName/Description to internal values only if they're currently empty (first visit)
        if (!HeaderName.trim()) {
            setHeaderName(formName);
        }
        if (!HeaderDescription.trim()) {
            setHeaderDescription(formDescription);
        }

        setView('layout');
    };
    
    // Handler to clear error when user starts typing in formName
    const handleFormNameChange = (value) => {
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

    const handlePublish = () => {
        if (formFields.length === 0) {
            alert("Please add at least one question before publishing.");
            return;
        }
        saveFormToLocal('published');
        console.log(`Form '${formName}' published!`);
        navigate('/'); 
    };

    const handlePreview = () => {
        // 1. Save the current state of the form as a draft. 
        // This ensures the preview page has the latest data from localStorage.
        saveFormToLocal('draft');
        
        // 2. Navigate to the new preview route using the form's unique ID.
        // We'll use a specific path like '/preview/:formId'
        navigate(`/preview/${currentFormId}`);
    };

    const handleDragStart = (field) => {
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
        if (!draggedField) return;

        let newFields = [...formFields];
        const existingIndex = newFields.findIndex(f => f.id === draggedField.id);

        if (existingIndex === -1) {
            // Add new field
            if (newFields.length < MAX_QUESTIONS) {
                const newField = createNewField(draggedField);
                const targetIndex = dragOverIndex !== null ? dragOverIndex : newFields.length;
                newFields.splice(targetIndex, 0, newField);
                setActiveFieldId(newField.id);
            }
        } else {
            // Reorder existing field
            newFields.splice(existingIndex, 1);
            const targetIndex = dragOverIndex !== null ? dragOverIndex : newFields.length;
            newFields.splice(targetIndex, 0, draggedField);
        }

        setFormFields(newFields);
        handleDragEnd();
    };

    // --- Field Management Handlers ---

    const handleUpdateField = (id, updates) => {
        setFormFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleDeleteField = (id) => {
        setFormFields(prev => prev.filter(f => f.id !== id));
        if (activeFieldId === id) setActiveFieldId(null);
    };

    // Dropdown option handlers
    const handleAddOption = (fieldId) => {
        setFormFields(prev => prev.map(f => {
            if (f.id === fieldId) {
                const newOptionId = f.options.length ? Math.max(...f.options.map(o => o.id)) + 1 : 1;
                return { ...f, options: [...f.options, { id: newOptionId, value: `Option ${newOptionId}` }] };
            }
            return f;
        }));
    };

    const handleUpdateOption = (fieldId, optionId, newValue) => {
        setFormFields(prev => prev.map(f => {
            if (f.id === fieldId) {
                return {
                    ...f,
                    options: f.options.map(o => o.id === optionId ? { ...o, value: newValue } : o)
                };
            }
            return f;
        }));
    };

    const handleDeleteOption = (fieldId, optionId) => {
        setFormFields(prev => prev.map(f => {
            if (f.id === fieldId) {
                return { ...f, options: f.options.filter(o => o.id !== optionId) };
            }
            return f;
        }));
    };
    return (
        <div className="form-builder-page">
            <div className="form-tabs">
                <div className={`tab ${view === 'config' ? 'active' : ''}`} onClick={() => setView('config')}>Form Configuration</div>
                <div className={`tab ${view === 'layout' ? 'active' : ''}`} onClick={handleSwitchToLayout}>Form Layout</div>
            </div>

            {view === 'config' ? (
                <ConfigView
                    formName={formName}
                    setFormName={handleFormNameChange} // 🎯 Use the new handler
                    formDescription={formDescription}
                    setFormDescription={setFormDescription}
                    isError={formNameError} // 🎯 Pass error state
                />
            ) : (
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
                    HeaderDescription={HeaderDescription} // 🎯 NEW PROP
                    setHeaderDescription={setHeaderDescription}
                />
            )}

            <div className="form-action-footer">
                {view === 'layout' && <button className="preview-btn" onClick={handlePreview}><FaPencilAlt /> Preview Form </button>}
                
                <button 
                    className="save-draft-btn" 
                    onClick={handleSave} 
                    // Allow saving draft even if name is empty, but it will save as 'Untitled Form'
                >
                    Save as draft
                </button>
                
                {view === 'config' ? (
                    <button className="next-btn" onClick={handleSwitchToLayout} >Next</button> /* Disabled check is now in handleNext */
                ) : (
                    <button className="next-btn publish-btn" onClick={handlePublish} disabled={!formName.trim()}>Publish Form</button>
                )}
            </div>
        </div>
    );
};

export default CreateForm;
