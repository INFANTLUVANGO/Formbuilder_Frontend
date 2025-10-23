// FormCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/FormCard.sass";

const FormCard = ({ form, openDropdownId, setOpenDropdownId, handleEdit, handleDelete }) => {
    const navigate = useNavigate();
    const isPublished = form.status === "published";
    const statusColor = isPublished ? "published" : "draft";

    const isOpen = openDropdownId === form.id;

    const toggleMenu = (e) => {
        e.stopPropagation(); 
        setOpenDropdownId(isOpen ? null : form.id);
    };

    // Handler for the Edit button click
    const handleEditClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null); 
        handleEdit(form.id); 
    };

    // Handler for the Delete button click
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        handleDelete(form.id);
    };

    // 🌟 UPDATED: Handler for the dropdown 'View Form' button (Opens read-only config/layout)
    const handleViewFormClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        // Navigates to the read-only view of the form configuration/layout
        navigate(`/view-form/${form.id}`); 
    };
    
    // 🌟 NEW: Handler for the footer 'View Responses' button (Directly to Responses Tab)
    const handleViewResponsesClick = (e) => {
        e.stopPropagation();
        setOpenDropdownId(null);
        // Navigates directly to the responses tab
        navigate(`/view-responses/${form.id}`); 
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
                                <button onClick={() => navigate("/assign-learner")}>Assign Learners</button>
                                <button onClick={handleViewFormClick}>View Form</button> {/* Uses view-form route */}
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
                <span className={`status ${statusColor}`}>
                    {isPublished ? "Published" : "Draft"}
                </span>
                {isPublished && (
                    <button className="view-btn" onClick={handleViewResponsesClick}> {/* Uses view-responses route */}
                        View Responses
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormCard;