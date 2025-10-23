import React from "react";
import { FaCopy, FaTrash } from 'react-icons/fa';
import AnswerInput from "./AnswerInput";
import "../../../Styles/CreateForm/FieldCard.sass"

// 1. 🔑 ACCEPT NEW PROPS: answerValue and handleAnswerChange
const FieldCard = ({ 
    field, 
    index, 
    activeFieldId, 
    setActiveFieldId, 
    handleDragStart, 
    handleDragEnd, 
    dragOverIndex, 
    setDragOverIndex, 
    handleUpdateField, 
    handleDeleteField, 
    handleAddOption, 
    handleUpdateOption, 
    handleDeleteOption, 
    handleCopyField, 
    isPreviewMode,
    // 🛑 NEW PROPS HERE:
    answerValue, 
    handleAnswerChange 
}) => {
    
    // Determine if we are in the Preview state
    const isPreview = isPreviewMode;
    
    // If in Preview mode, no field can be active for editing
    const isFieldActive = isPreview ? false : field.id === activeFieldId;

    return (
        <div 
            // 💡 ADDED: Conditionally add 'preview-mode' class
            className={`form-field-card ${isFieldActive ? 'active' : ''} ${isPreview ? 'preview-mode' : ''}`}
            
            // 🛑 REMOVE BUILDER FUNCTIONALITY IN PREVIEW
            draggable={!isPreview} 
            onDragStart={!isPreview ? () => handleDragStart(field) : undefined}
            onDragEnd={!isPreview ? handleDragEnd : undefined} 
            onDragOver={!isPreview ? (e) => { e.preventDefault(); setDragOverIndex(index); } : undefined}
            onDragLeave={!isPreview ? () => setDragOverIndex(null) : undefined}
            onClick={!isPreview ? () => setActiveFieldId(field.id) : undefined} // Only allow activation in editor mode
        >
            
            <div className="field-content">
                
                {/* 1. Question Title Rendering */}
                <div className={`field-content-line ${!isFieldActive ? 'display-view' : ''}`}>
                    {isPreview || !isFieldActive ? (
                        // PREVIEW MODE or inactive display mode in builder
                        <div className="field-question-display">
                            {/* 🔑 FIX: Render the number inside the display element for clean alignment */}
                            {isPreview && (
                                <div className={`question-number-display preview-number`}>
                                    {index + 1}
                                </div>
                            )}
                            {field.question || 'Untitled Question'}
                            {field.required && <span className="required-star">*</span>}
                        </div>
                    ) : (
                        // BUILDER ACTIVE MODE: Editable input
                        <>
                            <input
                                type="text"
                                value={field.question} 
                                onChange={(e) => handleUpdateField(field.id, { question: e.target.value })}
                                placeholder="Type your question here"
                                maxLength={150}
                                className="field-question-input"
                                disabled={!isFieldActive}
                            />
                            {isFieldActive && <span className="char-count">{field.question.length}/150</span>}
                        </>
                    )}
                </div>

                {/* 2. Description (Only display if showDescription is true) */}
                {field.showDescription && (
                    <div className={`field-content-line description-line ${!isFieldActive ? 'display-view' : ''} ${isPreview ? 'description-preview' : ''}`}> 
                        {isPreview || !isFieldActive ? (
                            // PREVIEW MODE / Inactive Builder: Display static text
                            <p className="field-description-display">
                                {field.description}
                            </p>
                        ) : (
                            // BUILDER ACTIVE MODE: Editable input
                            <>
                                <input
                                    type="text"
                                    value={field.description}
                                    onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                                    placeholder="Add a description (optional)"
                                    maxLength={300}
                                    className="field-description-input"
                                    disabled={!isFieldActive}
                                />
                                {isFieldActive && <span className="char-count">{field.description.length}/300</span>}
                            </>
                        )}
                    </div>
                )}

                {/* 3. Answer Input Rendering */}
                <div className="field-answer">
                    <AnswerInput 
                        field={field} 
                        activeFieldId={activeFieldId} 
                        handleUpdateField={handleUpdateField} 
                        handleAddOption={handleAddOption} 
                        handleUpdateOption={handleUpdateOption} 
                        handleDeleteOption={handleDeleteOption} 
                        isPreviewMode={isPreview}
                        // 2. 🔑 PASS NEW PROPS TO THE ANSWER INPUT
                        answerValue={answerValue}
                        handleAnswerChange={handleAnswerChange}
                    />
                </div>

                {/* 4. Settings Footer: Hide completely if in Preview Mode */}
                {!isPreview && isFieldActive && (
                    <div className="field-settings-footer">
                        <button type="button" className="action-btn copy-field-btn" onClick={() => handleCopyField(field.id)} title="Duplicate Field"><FaCopy /></button>
                        <button type="button" className="action-btn delete-field-btn" onClick={() => handleDeleteField(field.id)} title="Delete Field"><FaTrash /></button>
                        <div className="settings-group">
                            <label className="description-toggle">Description</label>
                            <input type="checkbox" className="toggle-switch" checked={field.showDescription} onChange={(e) => handleUpdateField(field.id, { showDescription: e.target.checked })} />
                        </div>
                        <div className="settings-group required-group">
                            <label className="required-toggle-label">Required</label>
                            <input type="checkbox" className="toggle-switch" checked={field.required} onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FieldCard;