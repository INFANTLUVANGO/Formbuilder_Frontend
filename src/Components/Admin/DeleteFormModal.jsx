// DeleteFormModal.jsx
import React from 'react';
import PropTypes from 'prop-types';

const DeleteFormModal = ({ form, onCancel, onConfirm }) => {
    return (
        // The overlay element covers the entire screen
        <div className="delete-modal-overlay" onClick={onCancel}>
            {/* The modal card, stops propagation so clicking inside doesn't close it */}
            <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* Header section similar to FormCard */}
                <div className="modal-card-header">
                    
                    <div className="header-info">
                        <div className="title-text">Delete Form</div>
                    </div>
                </div>

                {/* Content section */}
                <div className="modal-card-content">
                    <p className="message-title">Are you sure you want to delete the form?</p>
                    <p className="message-detail">
                        This will permanently remove all related data and cannot be undone.
                    </p>
                </div>

                {/* Footer buttons */}
                <div className="modal-card-actions">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="delete-confirm-btn" onClick={() => onConfirm(form.id)}>
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

DeleteFormModal.propTypes = {
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default DeleteFormModal;