// Components/Learner/LearnerFormCard.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Learner/LearnerFormCard.sass"; 

/**
 * A simplified card component for the Learner View.
 * Displays form details and a single 'Submit Response' action button.
 */
const LearnerFormCard = ({ form }) => {
    const navigate = useNavigate();
    
    // Destructure required fields
    const { id, title, description, headerName, dueDate } = form; // tagText and tagColor are ignored
    
    // --- Action Logic ---
    const handleStartAction = () => {
        // Navigates the user to the form submission page
        navigate(`/learner/submit/${id}`); 
    };

    return (
        <div className="learner-form-card"> 
            
            <div className="card-header">
                <h3 className="card-title">{title}</h3>
            </div>

            <div className="card-body">
                <p className="description">{description}</p>
            
                <p className="due-date">Due Date: <strong>{dueDate}</strong></p>
                
                {/* New Requirement: Use the Form Title as the 'tag' 
                  I am using a new class '.form-name-tag' for styling 
                */}
                <span className="form-tag form-name-tag">
                    {headerName}
                </span>
            </div>

            <div className="card-footer-action">
                <button 
                    // Use a generic class for consistent styling
                    className="action-btn submit-response" 
                    onClick={handleStartAction}
                >
                    Submit Response
                </button>
            </div>
        </div>
    );
};

export default LearnerFormCard;