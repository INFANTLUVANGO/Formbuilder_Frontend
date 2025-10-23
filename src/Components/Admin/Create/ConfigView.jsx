// ConfigView.jsx

import React from "react";
import "../../../Styles/CreateForm/ConfigView.sass"

// 🌟 UPDATED: Accept the new isReadOnly prop
const ConfigView = ({ formName, setFormName, formDescription, setFormDescription, isError, isReadOnly }) => {
    
    // If isReadOnly is true, the inputs are disabled and non-editable.

    return (
        <div className="form-details-section">
            <h2>Form Details</h2>
            <div className="input-group">
                <label htmlFor="formName" className="required">Form Name</label> 
                <div className={`input-container ${isError ? 'error-state' : ''}`}> 
                    <input 
                        id="formName" 
                        type="text" 
                        placeholder="Enter Form Name (Required)" 
                        maxLength={80} 
                        value={formName} 
                        onChange={(e) => setFormName(e.target.value)} 
                        // 🌟 ADDED: Disable input when in read-only mode
                        disabled={isReadOnly}
                    />
                    <span className="char-count">{formName.length}/80</span>
                </div>
                {isError && <p className="error-message">Form Name is required.</p>}
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
                        placeholder="Enter form description (Optional)"
                        // 🌟 ADDED: Disable textarea when in read-only mode
                        disabled={isReadOnly}
                    />
                    <span className="char-count">{formDescription.length}/200</span>
                </div>
            </div>
        </div>
    );
};

export default ConfigView;