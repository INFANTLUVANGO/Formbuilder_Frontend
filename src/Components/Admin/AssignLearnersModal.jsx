import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa'; // Icon for closing the modal
import "../../Styles/Admin/AssignLearners.sass"
import Search from "../../assets/Search.png"
 // Ensure the correct path

// --- MOCK DATA (Expanded for better pagination demonstration) ---
const mockLearners = [
  { id: 1001, name: "Alice Johnson", email: "alice.j@corp.com" },
  { id: 1002, name: "Bob Smith", email: "bob.s@corp.com" },
  { id: 1003, name: "Charlie Brown", email: "charlie.b@corp.com" },
  { id: 1004, name: "Diana Prince", email: "diana.p@corp.com" },
  { id: 1005, name: "Ethan Hunt", email: "ethan.h@corp.com" },
  { id: 1006, name: "Fiona Glenn", email: "fiona.g@corp.com" },
  { id: 1007, name: "George Harrison", email: "george.h@corp.com" },
  { id: 1008, name: "Holly Golightly", email: "holly.g@corp.com" },
  { id: 1009, name: "Ivan Drago", email: "ivan.d@corp.com" },
  { id: 1010, name: "Jasmine Kaur", email: "jasmine.k@corp.com" },
  { id: 1011, name: "Kyle Reese", email: "kyle.r@corp.com" },
  { id: 1012, name: "Laura Croft", email: "laura.c@corp.com" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const AssignLearnersModal = ({ form, onCancel, onConfirm }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLearnerIds, setSelectedLearnerIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  // --- Data Logic: Filtered Learners (Memoized for performance) ---
  const filteredLearners = useMemo(() => {
    return mockLearners.filter(learner =>
      learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.id.toString().includes(searchTerm) ||
      learner.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // --- Pagination Logic (Memoized) ---
  const totalFilteredPages = Math.ceil(filteredLearners.length / itemsPerPage);
  
  const paginatedLearners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLearners.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLearners, currentPage, itemsPerPage]);

  // --- Selection Helpers ---
  const isSelected = (id) => selectedLearnerIds.includes(id);
  const allOnPageSelected = paginatedLearners.length > 0 && paginatedLearners.every(l => isSelected(l.id));

  const handleSelectLearner = (id) => {
    setSelectedLearnerIds(prevIds => 
      prevIds.includes(id) 
        ? prevIds.filter(prevId => prevId !== id) 
        : [...prevIds, id]
    );
  };

  const handleSelectAll = (e) => {
    const pageIds = paginatedLearners.map(l => l.id);
    if (e.target.checked) {
      // Add only the IDs from the current page that aren't already selected
      setSelectedLearnerIds(prevIds => {
        const newIds = pageIds.filter(id => !prevIds.includes(id));
        return [...prevIds, ...newIds];
      });
    } else {
      // Remove all IDs from the current page
      setSelectedLearnerIds(prevIds => prevIds.filter(id => !pageIds.includes(id)));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalFilteredPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to page 1 on item count change
  };
  
  const handleAssignLearners = () => {
    if (selectedLearnerIds.length > 0) {
      onConfirm(form.id, selectedLearnerIds);
    }
  };

  // Helper function for display text
  const getLearnerRangeInfo = () => {
    if (filteredLearners.length === 0) return "0 learners";
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredLearners.length);
    return `Showing ${start}-${end} of ${filteredLearners.length} learners`;
  };
  
  return (
    // Re-using the modal overlay class, which handles the fixed background
    <div className="assign-modal-overlay" onClick={onCancel}> 
        <div className="assign-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="assign-header">
                <div className="header-info">
                    <div className="title-text">Assign Learners  : {form.title}</div>
                </div>
            </div>

            {/* Modal Content - Contains Search, Table, and Pagination */}
            <div className="assign-content">
                
                {/* SEARCH BAR */}
                <div className="assign-search-bar-container">
                    <img src={Search} alt="Search" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by User Name, User ID, or Email"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="learner-search-input"
                    />
                </div>

                {/* LEARNERS TABLE */}
                <div className="learner-table-wrapper">
                    <table className="learners-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>
                                    <input 
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={allOnPageSelected}
                                        // Indeterminate state for partial selection on the current page
                                        ref={input => {
                                            if (input) {
                                                const selectedOnPageCount = paginatedLearners.filter(l => isSelected(l.id)).length;
                                                input.indeterminate = selectedOnPageCount > 0 && selectedOnPageCount < paginatedLearners.length;
                                            }
                                        }}
                                    />
                                </th>
                                <th>User Name</th>
                                <th>User ID</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLearners.map((learner) => (
                                <tr 
                                  key={learner.id} 
                                  className={isSelected(learner.id) ? 'selected-row' : ''}
                                  onClick={() => handleSelectLearner(learner.id)} // Click row to select
                                >
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected(learner.id)} 
                                            onChange={() => handleSelectLearner(learner.id)} // Handle change explicitly
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="learner-name-cell"> 
                                        <FaUserCircle size={18} color="#5D38DF" />
                                        {learner.name}
                                    </td>
                                    <td>{learner.id}</td>
                                    <td>{learner.email}</td>
                                </tr>
                            ))}
                            {paginatedLearners.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="no-results">No learners found for "**{searchTerm}**".</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION ROW */}
                <div className="pagination-row">
                    <div className="items-per-page-selector">
                        <span>Items per page:</span>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="page-navigation">
                        <span className="current-page-info">
                            {getLearnerRangeInfo()}
                        </span>
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="nav-button"
                            aria-label="Previous page"
                        >
                            &lt;
                        </button>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                            className="nav-button"
                            aria-label="Next page"
                        >
                            &gt;
                        </button>
                    </div>
                </div>

            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="modal-card-actions">
                <button className="cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
                <button 
                    className="confirm-btn"
                    onClick={handleAssignLearners}
                    disabled={selectedLearnerIds.length === 0}
                >
                    Add Learners ({selectedLearnerIds.length})
                </button>
            </div>
        </div>
    </div>
  );
};

AssignLearnersModal.propTypes = {
    form: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired, // (formId, selectedLearnerIds)
};

export default AssignLearnersModal;