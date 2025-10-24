import React from "react";
import "../../../Styles/CreateForm/ConfigView.sass"

// Renamed Toggle component for Form Published/Draft Status
const FormStatusToggle = ({ isOn, handleToggle }) => {
    return (
        <div className="toggle-switch-container status-toggle"> {/* 🔑 ADDED: status-toggle class */}
            <input
                checked={isOn}
                onChange={handleToggle}
                className="toggle-checkbox"
                id="formStatusToggle" // Unique ID for ConfigView toggle
                type="checkbox"
            />
            <label
                style={{ background: isOn ? '#5D38DF' : '#ccc' }}
                className="toggle-label"
                htmlFor="formStatusToggle"
            >
                <span className={`toggle-button`} />
            </label>
        </div>
    );
};

// The ConfigView component
const ConfigView = ({ 
    formName, setFormName, 
    formDescription, setFormDescription, 
    isError, isReadOnly,
    // formVisibility is the state for Published/Draft status (true = published)
    formVisibility, setFormVisibility 
}) => {
    
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
                        disabled={isReadOnly}
                    />
                    <span className="char-count">{formDescription.length}/200</span>
                </div>
            </div>
            
            
            {/* Form Visibility Toggle - Controls Published/Draft state */}
            <div className="input-group form-visibility-group">
                <div className="visibility-header">
                    {/* 🔑 CHANGED THE LABEL TEXT */}
                    <label htmlFor="formStatusToggle">Form Visibility</label> 
                    <FormStatusToggle // The main status toggle
                        isOn={formVisibility} 
                        handleToggle={() => setFormVisibility(!formVisibility)} 
                        disabled={false} 
                    />
                </div>
                <p className="form-description-text">
                    Turn on to publish the form and display for learners.
                </p>
            </div>
        </div>
    );
};

export default ConfigView;