// ToggleVisibilityModal.jsx

import React from 'react';
import PropTypes from 'prop-types';// Assuming your modal styles are here

const ToggleVisibilityModal = ({ form, onCancel, onConfirm, newVisibility }) => {
    const action = newVisibility ? 'Enable' : 'Disable';
    
    // Determine the message based on the action
    const messageTitle = newVisibility 
        ? `Are you sure you want to ENABLE this form?`
        : `Are you sure you want to DISABLE this form?`;

    const messageDetail = newVisibility 
        ? `Enabling "${form.title}" will make it visible and accessible to assigned learners/users.`
        : `Disabling "${form.title}" will prevent access. Users will no longer be able to submit responses.`;
    
    const confirmAction = (e) => {
        e.stopPropagation();
        // Call the confirmation handler with form ID and the target visibility state
        onConfirm(form.id, newVisibility);
    };

    return (
        // Overlay (using the existing class)
        <div className="delete-modal-overlay" onClick={onCancel}>
            {/* Modal Card (using the existing class) */}
            <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* Header section */}
                <div className="modal-card-header">
                    <div className="header-info">
                        <div className="title-text">{action} Form Visibility</div>
                    </div>
                </div>

                {/* Content section */}
                <div className="modal-card-content">
                    <p className="message-title">{messageTitle}</p>
                    <p className="message-detail">
                        {messageDetail}
                    </p>
                    <p className="form-title-display">
                        Form: {form.title}
                    </p>
                </div>

                {/* Footer buttons */}
                <div className="modal-card-actions">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    {/* Use a unique class for styling (e.g., green for enable, red for disable) */}
                    <button 
                        className={`delete-confirm-btn ${newVisibility ? 'confirm-enable-style' : 'confirm-disable-style'}`} 
                        onClick={confirmAction}
                    >
                        Yes, {action}
                    </button>
                </div>
            </div>
        </div>
    );
};

ToggleVisibilityModal.propTypes = {
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    newVisibility: PropTypes.bool.isRequired,
};

export default ToggleVisibilityModal;