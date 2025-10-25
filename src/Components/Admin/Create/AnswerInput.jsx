import React, { useState } from "react";
import { FaPlusCircle } from 'react-icons/fa';
import "../../../Styles/CreateForm/AnswerInput.sass"

const AnswerInput = ({ 
    field, 
    activeFieldId, 
    handleUpdateField, 
    handleAddOption, 
    handleUpdateOption, 
    handleDeleteOption, 
    isPreviewMode,
    // 🔑 NEW PROPS from FieldCard
    isLearnerSubmission,
    isViewSubmission, // <== CRITICAL: For read-only view
    answerValue, 
    handleAnswerChange 
}) => {
    
    const isFieldActive = field.id === activeFieldId;
    // isPreview is true for Editor Preview and Learner Submission modes
    const isPreview = isPreviewMode || isLearnerSubmission;
    
    // The input is ONLY disabled if in Editor Preview mode, NOT in Learner Submission.
    // In View Submission mode, we use the static display logic.
    const isDisabled = isPreviewMode; 

    // --- DROPDOWN STATE LOGIC ---
    const [isOpen, setIsOpen] = useState(false);
    const isMultiSelect = field.selectionType === 'Multi Select';
    
    // Ensure answerValue is an array if Multi Select, otherwise treat it as a string.
    const currentAnswer = isMultiSelect ? (Array.isArray(answerValue) ? answerValue : []) : answerValue;

    // 3. DEFINE HANDLER FOR CUSTOM DROPDOWN OPTIONS (FIXED for Single/Multi Select)
    const handleOptionClick = (option) => {
        if (isViewSubmission) return; // Prevent interaction in view mode
        
        let newAnswer;

        if (isMultiSelect) {
            // Logic for Multi Select (Toggling items in an array)
            const isSelected = currentAnswer.includes(option.value);
            
            if (isSelected) {
                // Remove the option
                newAnswer = currentAnswer.filter(val => val !== option.value);
            } else {
                // Add the option
                newAnswer = [...currentAnswer, option.value];
            }
        } else {
            // Logic for Single Select (Setting a single value)
            newAnswer = option.value;
            setIsOpen(false); // Close the dropdown for Single Select
        }

        // 🔑 Call the controlled handler with the new answer
        handleAnswerChange(field.id, newAnswer);
    };

    // Helper function to format the display text for the button
    const getDropdownDisplayText = () => {
        if (isMultiSelect) {
            if (currentAnswer.length === 0) return "Select option(s)";
            if (currentAnswer.length === 1) return currentAnswer[0];
            return `${currentAnswer.length} options selected`;
        }
        // Single Select
        return currentAnswer || "Select an option";
    };

    // 🔑 CLASS LOGIC
    const inputClassName = isPreview ? 'preview-input-field' : (!isFieldActive ? 'display-view' : '');
    const previewPlaceholder = "Enter answer"; 
    
    // Handler for all standard inputs (Short/Long Text, Number, Date)
    const handleStandardChange = (e) => {
        if (isViewSubmission) return; // Prevent change in view mode

        if (isPreview) {
            handleAnswerChange(field.id, e.target.value);
        } else if (isFieldActive) {
            // Editor mode assumes answer is stored in field.answer
            handleUpdateField(field.id, { answer: e.target.value });
        }
    }
    
    // --- 🚀 CORE READ-ONLY VIEW LOGIC (isViewSubmission) ---
    if (isViewSubmission) {
        let displayValue;
        
        switch (field.label) {
            case "File Upload":
                // Assuming answerValue is an object like { name: 'file-name.pdf', url: 'https://...' }
                const fileData = answerValue; 
                return (
                    <div className="answer-view-file">
                        {fileData && fileData.url ? (
                            // RENDER THE FILE LINK
                            <a 
                                href={fileData.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="file-download-link"
                            >
                                {fileData.name || "Download File"}
                            </a>
                        ) : (
                            <p className="no-file-uploaded">No file uploaded.</p>
                        )}
                    </div>
                );
            case "Dropdown":
                // If it's multiselect, join the array; otherwise, display the string.
                displayValue = Array.isArray(answerValue) ? answerValue.join(', ') : answerValue;
                break;
            case "Date Picker":
            case "Short Text":
            case "Long Text":
            case "Number":
            default:
                // Default to raw answer value for text/number fields
                displayValue = answerValue;
                break;
        }

        return (
            <p className="answer-display read-only">
                {displayValue || 'No Answer Provided'}
            </p>
        );
    }
    // --- END OF CORE READ-ONLY VIEW LOGIC ---
    
    // --- INTERACTIVE (Preview/Learner Submission) / EDITOR LOGIC ---

    switch (field.label) {
        
        case "Short Text":
            return <input 
                type="text" 
                placeholder={isPreview ? previewPlaceholder : `Short Text (Up to 100 Character)`} 
                disabled={isDisabled}
                className={inputClassName}
                value={isPreview ? currentAnswer : field.answer || ''} 
                onChange={handleStandardChange}
            />;
        case "Long Text":
            return <textarea 
                placeholder={isPreview ? previewPlaceholder : "Long text (up to 200 chars)"} 
                disabled={isDisabled}
                className={inputClassName}
                value={isPreview ? currentAnswer : field.answer || ''} 
                onChange={handleStandardChange}
            />;
        case "Number":
            return <input 
                type="number" 
                placeholder={isPreview ? previewPlaceholder : "Enter number"} 
                disabled={isDisabled}
                className={inputClassName}
                value={isPreview ? currentAnswer : field.answer || ''} 
                onChange={handleStandardChange}
            />;
            
        case "Date Picker":
            if (isPreview) {
                return (
                    <div className="date-picker-config">
                        <input 
                            type="date"
                            placeholder={previewPlaceholder} 
                            className={`date-input preview-input-field`} 
                            disabled={isDisabled}
                            value={currentAnswer} 
                            onChange={handleStandardChange}
                        />
                    </div>
                );
            }
            // --- EDITOR LOGIC ---
            return (
                <div className="date-picker-config">
                    <input 
                        type="text" 
                        placeholder={`${field.dateFormat}`} 
                        onFocus={(e) => isFieldActive && (e.target.type = 'date')} 
                        onBlur={(e) => e.target.type = 'text'} 
                        className={`date-input ${!isFieldActive ? 'display-view' : ''}`} 
                        disabled={isDisabled}
                        value={field.answer || ''} 
                        onChange={handleStandardChange}
                    />
                    {!isPreview && isFieldActive && (
                        <div className="date-format-options">
                            <span className="label">Date Format:</span>
                            <button className={`format-btn ${field.dateFormat === 'DD/MM/YYYY' ? 'active' : ''}`} onClick={() => handleUpdateField(field.id, { dateFormat: 'DD/MM/YYYY' })} disabled={!isFieldActive}>DD/MM/YYYY</button>
                            <button className={`format-btn ${field.dateFormat === 'MM-DD-YYYY' ? 'active' : ''}`} onClick={() => handleUpdateField(field.id, { dateFormat: 'MM-DD-YYYY' })} disabled={!isFieldActive}>MM-DD-YYYY</button>
                        </div>
                    )}
                </div>
            );
            
        case "Dropdown":
            if (isPreview) {
                return (
                    <div className="custom-dropdown-wrapper">
                        {/* 1. The visible button/input area */}
                        <button
                            className="dropdown-display-button"
                            disabled={isDisabled}
                            onClick={() => setIsOpen(!isOpen)} 
                            aria-expanded={isOpen}
                        >
                            {getDropdownDisplayText()}
                            <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>&#9662;</span>
                        </button>

                        {/* 2. The floating list of options */}
                        {isOpen && (
                            <ul className="dropdown-options-list">
                                {field.options.map((option) => (
                                    <li 
                                        key={option.id} 
                                        className={`dropdown-option-item ${isMultiSelect && currentAnswer.includes(option.value) ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        {isMultiSelect && (<span className="checkbox-indicator">{currentAnswer.includes(option.value) ? '✅' : ''}</span>)}
                                        {option.value}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            }
            // --- EDITOR/DISPLAY VIEW LOGIC ---
            return (
                <div className="dropdown-config">
                    {isFieldActive ? (
                        <>
                            <div className="options-list">
                                {field.options.map((option, index) => {
                                    return (
                                        <div 
                                            key={option.id} 
                                            className="dropdown-option-row editing-option-row"
                                        >
                                            <input 
                                                type="text" 
                                                value={option.value} 
                                                onChange={(e) => handleUpdateOption(field.id, option.id, e.target.value)} 
                                                placeholder={`Option ${index + 1}`} 
                                                className="option-text-input" 
                                            />
                                            {field.options.length > 1 && isFieldActive && (
                                                <button onClick={() => handleDeleteOption(field.id, option.id)} className="remove-option-btn">X</button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            {isFieldActive && <button onClick={() => handleAddOption(field.id)} className="add-option-btn" disabled={!isFieldActive}><FaPlusCircle /> Add Option</button>}
                            {isFieldActive && (
                                <div className="selection-type-group">
                                    <span className="label">Selection Type:</span>
                                    <span 
                                        className={`type-option ${field.selectionType === 'Single Select' ? 'active' : ''}`} 
                                        onClick={() => handleUpdateField(field.id, { selectionType: 'Single Select' })} 
                                    >
                                        <span className="custom-radio"></span>
                                        Single Select
                                    </span>
                                    <span 
                                        className={`type-option ${field.selectionType === 'Multi Select' ? 'active' : ''}`} 
                                        onClick={() => handleUpdateField(field.id, { selectionType: 'Multi Select' })} 
                                    >
                                        <span className="custom-radio"></span>
                                        Multi Select
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        // Inactive Editor Display View
                        <div className="options-list display-view">
                            {field.options.map((option, index) => {
                                return (
                                    <div 
                                        key={option.id} 
                                        className="dropdown-option-row display-option-row" 
                                    >
                                        <input 
                                            type="text" 
                                            value={option.value} 
                                            disabled 
                                            className="option-text-input display-view" 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
            
        case "File Upload":
            if (isPreview) {
                return (
                    <div className="file-upload-config preview-view">
                        <input 
                            type="file" 
                            multiple={field.allowMultiple}
                            accept={field.allowedFormats.join(',')} 
                            className="preview-input-field"
                            disabled={isDisabled}
                            onChange={handleStandardChange} 
                        />
                        <p className="file-limits-preview">
                            {field.allowMultiple ? 'Multiple files allowed' : 'Only one file allowed'}. Supported: {field.allowedFormats.join(', ')}. Max size {field.maxSizeMB} MB
                        </p>
                    </div>
                );
            }
            // --- EDITOR LOGIC ---
            return (
                <div className="file-upload-config">
                    <input type="file" disabled className={!isFieldActive ? 'display-view' : ''} />
                    {!isPreview && (
                        <>
                            <p className="file-limits">File Upload ({field.allowMultiple ? 'Multiple files allowed' : 'Only one file allowed'})</p>
                            <p className="file-limits-details">Supported files: {field.allowedFormats.join(', ')}. Max file size {field.maxSizeMB} MB</p>
                        </>
                    )}
                </div>
            );
            
        default:
            return null;
    }
};

export default AnswerInput;