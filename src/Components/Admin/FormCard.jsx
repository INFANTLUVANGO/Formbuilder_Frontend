import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Admin/FormCard.sass";


// The ToggleSwitch component used in FormCard (No changes needed here)
const ToggleSwitch = ({ isOn, handleToggle, formId }) => { 
    // Creating a unique ID based on the formId to prevent conflicts in a list
    const uniqueId = `statusToggle-${formId}`;
    return (
        <div className="toggle-switch-container small-toggle visibility-toggle"> 
            <input
                checked={isOn}
                onChange={handleToggle}
                className="toggle-checkbox"
                id={uniqueId}
                type="checkbox"
            />
            <label
                style={{ background: isOn ? '#5D38DF' : '#ccc' }}
                className="toggle-label"
                htmlFor={uniqueId}
            >
                <span className={`toggle-button`} />
            </label>
        </div>
    );
};

const FormCard = ({ form, openDropdownId, setOpenDropdownId, handleEdit, handleDelete, handleToggleVisibility, handleAssignLearners }) => {
    const navigate = useNavigate();
    
    // Status Logic: isPublished determines the visual state for both the badge and the toggle
    const isPublished = form.status === "published";
    const isVisible = form.formVisibility;
    const statusColor = isPublished ? "published" : "draft";

    const isOpen = openDropdownId === form.id;

    const toggleMenu = (e) => {
        e.stopPropagation();
        setOpenDropdownId(isOpen ? null : form.id);
    };


    const handleAssignClick = (e) => {
        e.stopPropagation();
        // 💡 Calls the parent handler function to open the modal
        if (!isVisible) {
            // If formVisibility is false (off), show the alert
            alert("Assign restricted: Form is currently disabled (Visibility OFF).");
            return;
        }
        handleAssignLearners(form.id); 
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        handleEdit(form.id);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        handleDelete(form.id);
    };

    const handleViewFormClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        navigate(`/view-form/${form.id}`);
    };
        
    const handleViewResponsesClick = (e) => {
        e.stopPropagation();
        
        // Disable navigation if the form is a draft
        if (!isPublished) {
            console.log("Responses are not available for Draft forms.");
            return; 
        }

        setOpenDropdownId(null);
        navigate(`/view-responses/${form.id}`);
    };

    const onToggle = (e) => {
        e.stopPropagation();
        handleToggleVisibility(form.id, !isVisible); 
    };


    return (
        <div className="form-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
                <h3 className="card-title">{form.title}</h3>
                <button className="dots" onClick={toggleMenu}>⋮</button>

                {isOpen && (
                    <div className="dropdown">
                        {isPublished ? (
                            <>
                                <button onClick={handleAssignClick}>Assign Learners</button>
                                <button onClick={handleViewFormClick}>View Form</button>
                                <button className="delete" onClick={handleDeleteClick}>Delete</button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleEditClick}>Edit Form</button>
                                <button className="delete" onClick={handleDeleteClick}>Delete</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="card-body">
                {isPublished ? (
                    <>
                        <p>Published By:<strong> {form.publishedBy} </strong></p>
                        <p>Published Date:<strong> {form.publishedDate} </strong></p>
                    </>
                ) : (
                    <>
                        <p>Created By:<strong> {form.createdBy} </strong></p>
                        <p>Created Date:<strong> {form.createdDate} </strong></p>
                    </>
                )}
            </div>

            <div className="card-footer">
                {/* 1. Status (Published or Draft) is always shown */}
                <span className={`status ${statusColor}`}>
                    {isPublished ? "Published" : "Draft"}
                </span>

                {/* 🔑 FIX: Wrapper for all dynamic footer actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    
                    {/* 2. Enable Toggle: ONLY RENDERED IF PUBLISHED */}
                    {isPublished && (
                        <div className="status-toggle-wrapper">
                            <span className="status-label">Enabled</span>
                            <ToggleSwitch 
                                isOn={isVisible} 
                                handleToggle={onToggle} 
                                formId={form.id} 
                            />
                        </div>
                    )}
                        
                    {/* 3. View Responses Button: ALWAYS RENDERED, DISABLED IF DRAFT */}
                    <button 
                        className="view-btn" 
                        onClick={handleViewResponsesClick}
                        disabled={!isPublished} // <-- FIX: Disable if NOT published (i.e., Draft)
                    >
                        View Responses
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FormCard;