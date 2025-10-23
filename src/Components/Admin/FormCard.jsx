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
                                <button onClick={() => navigate("/view-form")}>View Form</button>
                                <button className="delete" onClick={handleDeleteClick}>Delete</button> {/* Delete for published */}
                            </>
                        ) : (
                            <>
                                <button onClick={handleEditClick}>Edit Form</button> {/* Edit for draft */}
                                <button className="delete" onClick={handleDeleteClick}>Delete</button> {/* Delete for draft */}
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
                    <button className="view-btn" onClick={() => navigate("/view-responses")}>
                        View Responses
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormCard;