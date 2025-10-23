import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../Styles/CreateForm.sass"; 
import { FaCalendarAlt, FaFile, FaList, FaSortNumericUp, FaStream, FaPencilAlt, FaPlusCircle, FaTrash, FaCopy } from 'react-icons/fa'; 

const inputFields = [
    { label: "Short Text", icon: FaPencilAlt },
    { label: "Long Text", icon: FaStream },
    { label: "Date Picker", icon: FaCalendarAlt },
    { label: "Dropdown", icon: FaList },
    { label: "File Upload", icon: FaFile },
    { label: "Number", icon: FaSortNumericUp },
];

const MAX_QUESTIONS = 10;
const MAX_QUESTION_CHARS = 150; 
const MAX_DESCRIPTION_CHARS = 300; 
const MAX_SHORT_TEXT_ANSWER_CHARS = 100;

// Helper function to create a new field with default specific properties
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

const CreateForm = () => {
    const [view, setView] = useState('config');
    const [formName, setFormName] = useState('Post-Course Experience');
    const [formDescription, setFormDescription] = useState('Summarize the form\'s purpose for internal reference.');
    const [draggedField, setDraggedField] = useState(null);
    const [formFields, setFormFields] = useState([]);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [activeFieldId, setActiveFieldId] = useState(null);

    const navigate = useNavigate();

    const handleSaveAsDraft = async () => { console.log('Saving draft...'); };
    const handleNext = () => setView('layout');
    const handleSaveLayout = async () => { console.log('Saving layout...'); };
    const handlePublish = async () => { console.log('Publishing form...'); };

    // --- Clears the dragging state after drop/cancel ---
    const handleDragEnd = () => {
        setDraggedField(null);
        setDragOverIndex(null);
    };
    // --------------------------------------------------------

    // Drag & Drop handlers
    const handleDragStart = (field) => {
        setDraggedField(field);
        setActiveFieldId(null);
    };
    
    const handleDragOver = (index) => {
        if (formFields.some(f => f.id === draggedField?.id)) {
            setDragOverIndex(index);
        } else {
            setDragOverIndex(null);
        }
    };

    const handleDrop = () => {
        if (!draggedField) return;
        let newFields = [...formFields];
        const isExistingField = formFields.some(f => f.id === draggedField.id);

        if (!isExistingField) {
            // ADD NEW FIELD: Sets the new field as active
            if (formFields.length < MAX_QUESTIONS) {
                 const newField = createNewField(draggedField);
                 newFields.push(newField);
                 setActiveFieldId(newField.id); // <--- Critical: set as active
            }
        } 
        else {
            // REORDERING EXISTING FIELD
            const currentIndex = newFields.findIndex(f => f.id === draggedField.id);
            if (currentIndex !== -1) {
                newFields.splice(currentIndex, 1);
                const targetIndex = dragOverIndex !== null ? dragOverIndex : newFields.length;
                newFields.splice(targetIndex, 0, draggedField);
            }
        }

        setFormFields(newFields);
        // handleDragEnd is responsible for resetting draggedField/dragOverIndex
    };

    const handleUpdateField = (id, updates) => {
        setFormFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleDeleteField = (id) => {
        setFormFields(prev => prev.filter(f => f.id !== id));
        if (activeFieldId === id) setActiveFieldId(null);
    };
    
    // Dropdown Option Handlers 
    const handleAddOption = (fieldId) => {
        setFormFields(prev => prev.map(f => {
            if (f.id === fieldId) {
                const newOptionId = f.options.length ? Math.max(...f.options.map(opt => opt.id)) + 1 : 1;
                return {
                    ...f,
                    options: [...f.options, { id: newOptionId, value: `Option ${newOptionId}` }]
                };
            }
            return f;
        }));
    };

    const handleUpdateOption = (fieldId, optionId, newValue) => {
        setFormFields(prev => prev.map(f => {
            if (f.id === fieldId) {
                return {
                    ...f,
                    options: f.options.map(opt => opt.id === optionId ? { ...opt, value: newValue } : opt)
                };
            }
            return f;
        }));
    };

    const handleDeleteOption = (fieldId, optionId) => {
        setFormFields(prev => prev.map(f => {
            if (f.id === fieldId) {
                return {
                    ...f,
                    options: f.options.filter(opt => opt.id !== optionId)
                };
            }
            return f;
        }));
    };

   const renderAnswerInput = (field) => {
    const isFieldActive = field.id === activeFieldId;

    switch (field.label) {
        case "Short Text":
            return <input type="text" placeholder={`Short Text (Up to ${MAX_SHORT_TEXT_ANSWER_CHARS} Character)`} readOnly={!isFieldActive} className={!isFieldActive ? 'display-view' : ''} />;
        case "Long Text":
            return <textarea placeholder="Long text (up to 200 chars)" readOnly={!isFieldActive} className={!isFieldActive ? 'display-view' : ''} />;
        case "Number":
            return <input type="number" placeholder="Enter number" readOnly={!isFieldActive} className={!isFieldActive ? 'display-view' : ''} />;
        case "Date Picker":
            return (
                <div className="date-picker-config">
                    <input 
                        type="text" 
                        placeholder={`Select the date (${field.dateFormat})`} 
                        onFocus={(e) => isFieldActive && (e.target.type = 'date')} 
                        onBlur={(e) => e.target.type = 'text'} 
                        className={`date-input ${!isFieldActive ? 'display-view' : ''}`} 
                        disabled={!isFieldActive}
                    />
                    {isFieldActive && (
                        <div className="date-format-options">
                            <span className="label">Date Format:</span>
                            <button className={`format-btn ${field.dateFormat === 'DD/MM/YYYY' ? 'active' : ''}`} onClick={() => handleUpdateField(field.id, { dateFormat: 'DD/MM/YYYY' })} disabled={!isFieldActive}>DD/MM/YYYY</button>
                            <button className={`format-btn ${field.dateFormat === 'MM-DD-YYYY' ? 'active' : ''}`} onClick={() => handleUpdateField(field.id, { dateFormat: 'MM-DD-YYYY' })} disabled={!isFieldActive}>MM-DD-YYYY</button>
                        </div>
                    )}
                </div>
            );
        case "Dropdown":
            return (
                <div className="dropdown-config">
                    {isFieldActive ? (
                        // --- EDIT VIEW (ACTIVE) - Shows Radio/Checkbox List for configuration ---
                        <>
                            <div className="options-list">
                                {field.options.map((option, index) => {
                                    const inputType = field.selectionType === 'Single Select' ? 'radio' : 'checkbox';
                                    const optionClass = isFieldActive ? 'editing-option-row' : 'display-option-row';

                                    return (
                                        <div key={option.id} className={`dropdown-option-row ${optionClass}`}>
                                            {/* Visual/Preview Input (Radio/Checkbox) */}
                                            <input 
                                                type={inputType} 
                                                readOnly 
                                                disabled 
                                                className="option-preview-input"
                                                name={field.selectionType === 'Single Select' ? `radio-group-${field.id}` : ''}
                                            />
                                            {/* Editable Input/Text Label */}
                                            <input 
                                                type="text" 
                                                value={option.value} 
                                                onChange={(e) => handleUpdateOption(field.id, option.id, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                disabled={!isFieldActive}
                                                className="option-text-input" 
                                            />
                                            {/* Delete Button (Only visible when active and > 1 option) */}
                                            {field.options.length > 1 && isFieldActive && (
                                                <button onClick={() => handleDeleteOption(field.id, option.id)} className="remove-option-btn" disabled={!isFieldActive}>X</button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            {isFieldActive && (
                                <button onClick={() => handleAddOption(field.id)} className="add-option-btn" disabled={!isFieldActive}><FaPlusCircle /> Add Option</button>
                            )}
                            
                            {isFieldActive && (
                                <div className="selection-type-group">
                                    <span className="label">Selection Type:</span>
                                    <button className={`type-btn ${field.selectionType === 'Single Select' ? 'active' : ''}`} onClick={() => handleUpdateField(field.id, { selectionType: 'Single Select' })} disabled={!isFieldActive}>Single Select</button>
                                    <button className={`type-btn ${field.selectionType === 'Multi Select' ? 'active' : ''}`} onClick={() => handleUpdateField(field.id, { selectionType: 'Multi Select' })} disabled={!isFieldActive}>Multi Select</button>
                                </div>
                            )}
                        </>
                    ) : (
                        // --- DISPLAY VIEW (INACTIVE) - NOW SHOWS RADIO/CHECKBOX LIST ---
                        <div className="options-list display-view">
                            {field.options.map(option => {
                                const inputType = field.selectionType === 'Single Select' ? 'radio' : 'checkbox';
                                return (
                                    <div key={option.id} className="dropdown-option-row display-option-row">
                                        <input 
                                            type={inputType} 
                                            disabled // Disable interaction in the builder's display view
                                            className="option-preview-input"
                                            name={field.selectionType === 'Single Select' ? `radio-group-${field.id}` : ''}
                                        />
                                        <span className="option-text-label">{option.value}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            );
        case "File Upload":
            return (
                <div className="file-upload-config">
                    <input type="file" disabled={!isFieldActive} className={!isFieldActive ? 'display-view' : ''} /> 
                    <p className="file-limits">
                        File Upload ({field.allowMultiple ? 'Multiple files allowed' : 'Only one file allowed'})
                    </p>
                    <p className="file-limits-details">
                        Supported files: {field.allowedFormats.join(', ')}. Max file size {field.maxSizeMB} MB
                    </p>
                </div>
            );
        default:
            return null;
    }
};

    const renderFieldCard = (field, index) => {
        const isFieldActive = field.id === activeFieldId;
        
        return (
            <div 
                className={`form-header-card field-card ${isFieldActive ? 'active' : ''}`}
                draggable
                onDragStart={() => handleDragStart(field)}
                onDragEnd={handleDragEnd} 
                onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
                onDragLeave={() => setDragOverIndex(null)}
                onClick={() => setActiveFieldId(field.id)}
                key={field.id}
            >
                {/* Header Actions & Char Count: Hidden when inactive to simplify the display view */}
                {isFieldActive && (
                    <div className="card-header-actions">
                        <span className="char-count-card">{field.question.length}/{MAX_QUESTION_CHARS}</span> 
                        <span className="card-handle">•••</span>
                    </div>
                )}

                <div className="header-content">
                    <div className="content-line">
                        <input
                            type="text"
                            value={field.question}
                            maxLength={MAX_QUESTION_CHARS}
                            onChange={(e) => handleUpdateField(field.id, { question: e.target.value })}
                            placeholder="Untitled Question"
                            className="field-question-input"
                            disabled={!isFieldActive}
                        />
                    </div>

                    {field.showDescription && (
                        <div className={`field-description-line ${!isFieldActive ? 'display-view' : ''}`}> 
                            <input
                                type="text"
                                value={field.description}
                                maxLength={MAX_DESCRIPTION_CHARS}
                                onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                                placeholder="Description"
                                className="field-description-input"
                                disabled={!isFieldActive}
                            />
                            {isFieldActive && <span className="char-count-description">{field.description.length}/{MAX_DESCRIPTION_CHARS}</span>}
                        </div>
                    )}
                    
                    <div className="field-answer">
                        {renderAnswerInput(field)}
                    </div>

                    {/* Settings Footer: Only visible in Edit State */}
                    {isFieldActive && (
                        <div className="field-settings-footer">
                            <button type="button" className="action-btn copy-field-btn" title="Duplicate Field" disabled={!isFieldActive}>
                                <FaCopy />
                            </button>
                            <button type="button" className="action-btn delete-field-btn" onClick={() => handleDeleteField(field.id)} title="Delete Field">
                                <FaTrash />
                            </button>
                            
                            <div className="settings-group">
                                <label className="description-toggle">
                                    Description
                                </label>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={field.showDescription}
                                    onChange={(e) => handleUpdateField(field.id, { showDescription: e.target.checked })}
                                    disabled={!isFieldActive}
                                />
                            </div>
                            
                            <div className="settings-group required-group">
                                <label className="required-toggle-label">
                                    Required
                                </label>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={field.required}
                                    onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                    disabled={!isFieldActive}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const renderConfigView = () => (
        <div className="form-details-section">
            <h2>Form Details</h2>
            <div className="input-group">
                <label htmlFor="formName" className="required">Form Name</label> 
                <div className="input-container">
                    <input
                        id="formName"
                        type="text"
                        placeholder="Enter Form Name"
                        maxLength={80}
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                    />
                    <span className="char-count">{formName.length}/80</span>
                </div>
            </div>

            <div className="input-group">
                <label htmlFor="formDescription">Form Description</label>
                <p className="form-description-text">Summarize the form's purpose for internal reference.</p>
                <div className="input-container textarea-container">
                    <textarea
                        id="formDescription"
                        maxLength={200}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                    />
                    <span className="char-count">{formDescription.length}/200</span>
                </div>
            </div>
        </div>
    );

    const renderLayoutView = () => (
        <div className="form-layout-builder">
            <div className="layout-sidebar">
                <div className="sidebar-tabs">
                    <div className="sidebar-tab active">Input Fields</div>
                    <div className="sidebar-tab disabled">UDF Fields</div>
                </div>
                <div className="field-palette">
                    {inputFields.map(field => {
                        const Icon = field.icon;
                        return (
                            <div 
                                key={field.label} 
                                className="field-btn"
                                draggable={formFields.length < MAX_QUESTIONS} 
                                onDragStart={() => handleDragStart(field)}
                                onDragEnd={handleDragEnd} 
                            >
                                <Icon className="field-icon"/>
                                <span>{field.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="layout-canvas-wrapper">
                <div className="combine">
                    <div className="header-label">Form Header</div>
                    <div className="form-header-card" onClick={() => setActiveFieldId(null)}>
                        <div className="header-content">
                            <div className="content-line">
                                <input 
                                    type="text" 
                                    placeholder="Header Name" 
                                    maxLength={80} 
                                    className="header-input-title" 
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                />
                                <span className="char-count-header">{formName.length}/80</span>
                            </div>
                            <div className="content-line">
                                <input 
                                    type="text" 
                                    placeholder="Form Description (optional)" 
                                    className="header-input-description"
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                />
                                <span className="char-count-header">{formDescription.length}/200</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="questions-scroll"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {formFields.map((field, index) => (
                        <React.Fragment key={field.id}>
                            {/* Drop indicator for REORDERING only */}
                            {draggedField && formFields.some(f => f.id === draggedField.id) && dragOverIndex === index && (
                                <div className="drag-drop-area drop-indicator">
                                    <FaPlusCircle className="drag-icon"/>
                                    <p>Drop here</p>
                                </div>
                            )}
                            {renderFieldCard(field, index)}
                        </React.Fragment>
                    ))}
                    
                    {/* Drop indicator at the bottom for REORDERING OR ADDING */}
                    {(draggedField || formFields.length === 0) && formFields.length < MAX_QUESTIONS && (
                        <div className="drag-drop-area empty-state bottom-drop-area">
                            <FaPlusCircle className="drag-icon"/>
                            <p>{formFields.length === 0 ? "Drag fields from the left panel" : "Drop here to add/reorder at the end"}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="form-builder-page">
            <div className="form-tabs">
                <div className={`tab ${view === 'config' ? 'active' : ''}`} onClick={() => setView('config')}>Form Configuration</div>
                <div className={`tab ${view === 'layout' ? 'active' : ''}`} onClick={() => setView('layout')}>Form Layout</div>
            </div>

            {view === 'config' ? renderConfigView() : renderLayoutView()}

            <div className="form-action-footer">
                {view === 'layout' && <button className="preview-btn"><FaPencilAlt /> Preview Form </button>}
                <button className="save-draft-btn" onClick={view === 'config' ? handleSaveAsDraft : handleSaveLayout} disabled={!formName.trim()}>Save as draft</button>
                {view === 'config' ? (
                    <button className="next-btn" onClick={handleNext} disabled={!formName.trim()}>Next</button>
                ) : (
                    <button className="next-btn publish-btn" onClick={handlePublish} disabled={!formName.trim()}>Publish Form</button>
                )}
            </div>
        </div>
    );
};

export default CreateForm;