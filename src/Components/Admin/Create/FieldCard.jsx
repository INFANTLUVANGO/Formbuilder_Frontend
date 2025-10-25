import React from "react";
import { FaCopy, FaTrash } from 'react-icons/fa';
import AnswerInput from "./AnswerInput";
import "../../../Styles/CreateForm/FieldCard.sass"


const FieldCard = ({ 
  field, 
  index, 
  activeFieldId, 
  setActiveFieldId, 
  handleDragStart, 
  handleDragEnd, 
  setDragOverIndex, 
  handleUpdateField, 
  handleDeleteField, 
  handleAddOption, 
  handleUpdateOption, 
  handleDeleteOption, 
  handleCopyField, 
  isPreviewMode,
  // 🔑 Mode Props
  isLearnerSubmission,
    isViewSubmission, // <== CRITICAL: For read-only view
  // Answer Props
  answerValue, 
  handleAnswerChange 
}) => {
  
  // Disable editing functionality if in Preview, Learner Submission, or View Submission mode.
    const isEditingDisabled = isPreviewMode || isViewSubmission || isLearnerSubmission;
  const isFieldActive = isEditingDisabled ? false : field.id === activeFieldId;

  // 🔑 NEW: Define a single flag for all read-only display modes
    const isDisplayMode = isPreviewMode || isViewSubmission || isLearnerSubmission;
    // The content line should be in 'display-view' if it's NOT the active editor or it IS one of the display modes
    const showDisplayView = isDisplayMode || !isFieldActive;

  return (
    <div 
      className={`form-field-card ${isFieldActive ? 'active' : ''} ${isEditingDisabled ? 'preview-mode' : ''}`}
      
      // Disable builder functions (drag/click-to-edit) in all non-editor modes
      draggable={!isEditingDisabled} 
      onDragStart={!isEditingDisabled ? () => handleDragStart(field) : undefined}
      onDragEnd={!isEditingDisabled ? handleDragEnd : undefined} 
      onDragOver={!isEditingDisabled ? (e) => { e.preventDefault(); setDragOverIndex(index); } : undefined}
      onDragLeave={!isEditingDisabled ? () => setDragOverIndex(null) : undefined}
      onClick={!isEditingDisabled ? () => setActiveFieldId(field.id) : undefined} 
    >
      
        <div className="field-content">

                <div className={`field-content-line ${!isFieldActive ? 'display-view' : ''}`}>
                    {showDisplayView || !isFieldActive ? (
                        // PREVIEW MODE or inactive display mode in builder
                        <div className="field-question-display">
                            {/* 🔑 FIX: Render the number inside the display element for clean alignment */}
                            {(isPreviewMode || isLearnerSubmission || isViewSubmission) && (
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
                    <div className={`field-content-line description-line ${!isFieldActive ? 'display-view' : ''} ${showDisplayView ? 'description-preview' : ''}`}> 
                        {showDisplayView|| !isFieldActive ? (
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
                
                            // 🔑 PASS ALL MODE FLAGS DOWN
                isPreviewMode={isPreviewMode}
                            isLearnerSubmission={isLearnerSubmission}
                            isViewSubmission={isViewSubmission} // <== CRITICAL
                            
                // Answer props
                answerValue={answerValue}
                handleAnswerChange={handleAnswerChange}
            />
            </div>

            {/* 4. Settings Footer: Hide if editing is disabled */}
            {!isEditingDisabled && isFieldActive && (
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

