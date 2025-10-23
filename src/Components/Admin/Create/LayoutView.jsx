// LayoutView.jsx

import { FaPlusCircle } from 'react-icons/fa';
import React, { useRef } from "react";
import FieldCard from "./FieldCard";
import "../../../Styles/CreateForm/LayoutView.sass"


const LayoutView = ({
    inputFields,
    formFields,
    draggedField,
    dragOverIndex,
    setDragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    activeFieldId,
    setActiveFieldId,
    handleUpdateField,
    handleDeleteField,
    handleAddOption,
    handleUpdateOption,
    handleDeleteOption,
    HeaderName,
    setHeaderName,
    HeaderDescription,
    setHeaderDescription,
    // 🌟 UPDATED: Accept the new isReadOnly prop
    isReadOnly
}) => {
    const lastDragOverIndex = useRef(null);

    const handleThrottledDragOver = (index) => {
        if (lastDragOverIndex.current !== index) {
            setDragOverIndex(index);
            lastDragOverIndex.current = index;
        }
    };
    
    // The header is active (edit mode) when no field card is active AND we are NOT in read-only mode
    const isHeaderActive = activeFieldId === null && !isReadOnly;

    // Helper to create a clean CSS class name from the field label (e.g., 'Short Text' -> 'shorttext')
    const getFieldClass = (label) => label.toLowerCase().replace(/\s/g, '');

    return (
        <div className="form-layout-builder">
            {/* 🌟 1. DISABLE FIELD PALETTE ENTIRELY WHEN READ-ONLY */}
             
                <div className={`layout-sidebar ${isReadOnly ? 'disabled' : ''}`}>
                    <div className="sidebar-tabs">
                        <div className="sidebar-tab active">Input Fields</div>
                        <div className="sidebar-tab disabled">UDF Fields</div>
                    </div>
                    <div className="field-palette">
                        {inputFields.map(field => {
                            return (
                                <div
                                    key={field.label}
                                    className="field-btn"
                                    draggable={formFields.length < 10}
                                    onDragStart={() => handleDragStart(field)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className={`icon-bg-wrapper ${getFieldClass(field.label)}`}>
                                        <img src={field.icon} alt={field.label} className="field-icon"/>
                                    </div>
                                    <span>{field.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            

            <div className="layout-canvas-wrapper">
                <div className="combine">
                    <div className="header-label">Form Header</div>
                    <div 
                        className={`form-header-card ${isHeaderActive ? 'active' : ''} ${isReadOnly ? 'read-only' : ''}`} 
                        // 🌟 DISABLE CLICKING TO ACTIVATE HEADER WHEN READ-ONLY
                        onClick={() => !isReadOnly && setActiveFieldId(null)}
                    >
                        <div className="header-content">
                            {/* Header Name (Title) */}
                            <div className={`content-line ${isHeaderActive || isReadOnly ? '' : 'display-view'}`}>
                                {isHeaderActive ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Header Name"
                                            maxLength={80}
                                            className="header-input-title"
                                            value={HeaderName}
                                            onChange={(e) => setHeaderName(e.target.value)}
                                        />
                                        <span className="char-count-header">{HeaderName.length}/80</span>
                                    </>
                                ) : (
                                    <div className="header-display-text header-input-title">
                                        {HeaderName || 'Untitled Form'} 
                                    </div>
                                )}
                            </div>

                            {/* Header Description */}
                            <div className={`content-line ${isHeaderActive || isReadOnly ? '' : 'display-view'}`}>
                                {isHeaderActive ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Form Description (optional)"
                                            className="header-input-description"
                                            value={HeaderDescription}
                                            onChange={(e) => setHeaderDescription(e.target.value)}
                                        />
                                        <span className="char-count-header">{HeaderDescription.length}/200</span>
                                    </>
                                ) : (
                                    (HeaderDescription.trim() !== '') && (
                                        <div className="header-display-text header-input-description">
                                            {HeaderDescription}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="questions-scroll"
                    // 🌟 DISABLE DRAG/DROP EVENTS WHEN READ-ONLY
                    onDragOver={!isReadOnly ? (e) => e.preventDefault() : null}
                    onDrop={!isReadOnly ? handleDrop : null}
                >
                    {formFields.map((field, index) => (
                        <React.Fragment key={field.id}>
                            {draggedField && draggedField.id !== field.id && dragOverIndex === index && !isReadOnly && (
                                <div className="drag-drop-area placeholder">
                                    <FaPlusCircle className="drag-icon"/>  
                                    <p></p>
                                </div>
                            )}
                            <FieldCard
                                field={field}
                                index={index}
                                activeFieldId={activeFieldId}
                                // 🌟 Pass down read-only prop to FieldCard
                                isReadOnly={isReadOnly}
                                setActiveFieldId={setActiveFieldId}
                                handleDragStart={handleDragStart}
                                handleDragEnd={handleDragEnd}
                                dragOverIndex={dragOverIndex}
                                setDragOverIndex={handleThrottledDragOver}
                                handleUpdateField={handleUpdateField}
                                handleDeleteField={handleDeleteField}
                                handleAddOption={handleAddOption}
                                handleUpdateOption={handleUpdateOption}
                                handleDeleteOption={handleDeleteOption}
                                isPreviewMode={false}
                            />
                        </React.Fragment>
                    ))}

                    {/* 🌟 HIDE BOTTOM DROP AREA WHEN READ-ONLY */}
                    {(!isReadOnly) && (draggedField || formFields.length === 0) && formFields.length < 10 && (
                        <div 
                            className="drag-drop-area empty-state bottom-drop-area"
                            onDragOver={(e) => handleThrottledDragOver(formFields.length)}
                            onDrop={(e) => handleDrop(e, formFields.length)}
                        >
                            <FaPlusCircle className="drag-icon"/>
                            <p>{formFields.length === 0 ? "Drag fields from the left panel" : "Drop here to add/reorder at the end"}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LayoutView;