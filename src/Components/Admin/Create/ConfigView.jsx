import React from "react";
import "../../../Styles/CreateForm/ConfigView.sass"

// 🎯 Accept the new isError prop
const ConfigView = ({ formName, setFormName, formDescription, setFormDescription, isError }) => {
    
    // Determine if we are in "creation mode" (i.e., formName is empty)
    // We only remove the 'value' prop if formName is empty. If it has a value (EDIT mode), we keep it.
    const isEditing = formName.length > 0;

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
                        // 🎯 CONDITIONALLY APPLY 'value': Only use value if we are editing (formName exists)
                        // This allows the input to be truly uncontrolled when formName is '' (creation mode).
                        // Note: If you want to strictly control it always, use `value={formName}`
                        value={formName} 
                        onChange={(e) => setFormName(e.target.value)} 
                    />
                    <span className="char-count">{formName.length}/80</span>
                </div>
                {/* 🎯 DISPLAY ERROR MESSAGE */}
                {isError && <p className="error-message">Form Name is required.</p>}
            </div>

            <div className="input-group">
                <label htmlFor="formDescription">Form Description</label>
                <p className="form-description-text">Summarize the form's purpose for internal reference.</p>
                <div className="input-container textarea-container">
                    <textarea 
                        id="formDescription" 
                        maxLength={200} 
                        // 🎯 CONDITIONALLY APPLY 'value'
                        value={formDescription} 
                        onChange={(e) => setFormDescription(e.target.value)} 
                        placeholder="Enter form description (Optional)"
                    />
                    <span className="char-count">{formDescription.length}/200</span>
                </div>
            </div>
        </div>
    );
};

export default ConfigView;