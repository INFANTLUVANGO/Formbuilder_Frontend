import React, { useRef } from "react";
import FieldCard from "./FieldCard";
import { FaPlusCircle } from 'react-icons/fa';
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
    setHeaderDescription
}) => {
    const lastDragOverIndex = useRef(null);

    const handleThrottledDragOver = (index) => {
        if (lastDragOverIndex.current !== index) {
            setDragOverIndex(index);
            lastDragOverIndex.current = index;
        }
    };
    
    // The header is active (edit mode) when no field card is active
    const isHeaderActive = activeFieldId === null;

    return (
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
                                draggable={formFields.length < 10}
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
                    <div 
                        className={`form-header-card ${isHeaderActive ? 'active' : ''}`} 
                        onClick={() => setActiveFieldId(null)}
                    >
                        <div className="header-content">
                            {/* Header Name (Title) */}
                            <div className={`content-line ${isHeaderActive ? '' : 'display-view'}`}>
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
                            <div className={`content-line ${isHeaderActive ? '' : 'display-view'}`}>
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
                                    // 🎯 FIX: When NOT active, display the text only if it exists. 
                                    // Otherwise, render nothing (or a subtle empty div/span to maintain layout)
                                    // We only render this div if there IS a description, or if we need the space.
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
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {/* ... Field Cards Loop (unchanged) ... */}
                    {formFields.map((field, index) => (
                        <React.Fragment key={field.id}>
                            {draggedField && draggedField.id !== field.id && dragOverIndex === index && (
                                <div className="drag-drop-area placeholder">
                                    <FaPlusCircle className="drag-icon"/>
                                    <p></p>
                                </div>
                            )}
                            <FieldCard
                                field={field}
                                index={index}
                                activeFieldId={activeFieldId}
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

                    {(draggedField || formFields.length === 0) && formFields.length < 10 && (
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