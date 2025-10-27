// ResponseView.jsx

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import "../../../Styles/CreateForm/ResponseView.sass" 
import Search from "../../../assets/Search.png"
// Note: Assuming 'noResponses' is the single, composite image for the empty state
import noResponses from "../../../assets/noResponses.jpg" 


// --- MOCK DATA ---
const mockResponses = [
    { id: 201, submitterName: "Alice Johnson", userId: 1001, submittedOn: "2025-10-20", email: "alice.j@corp.com", status: "Submitted" },
    { id: 202, submitterName: "Bob Smith", userId: 1002, submittedOn: "2025-10-18", email: "bob.s@corp.com", status: "Submitted" },
];

const mockAssignedByMe = [
    { id: 301, submitterName: "Liam O'Connell", userId: 2001, submittedOn: "2025-10-25", email: "liam.o@corp.com", status: "Submitted" },
    { id: 302, submitterName: "Olivia Davis", userId: 2002, submittedOn: null, email: "olivia.d@corp.com", status: "Pending" },
    { id: 303, submitterName: "Noah Martin", userId: 2003, submittedOn: null, email: "noah.m@corp.com", status: "Pending" },
    { id: 304, submitterName: "Emma Rodriguez", userId: 2004, submittedOn: "2025-10-22", email: "emma.r@corp.com", status: "Submitted" },
    { id: 305, submitterName: "Ava Wilson", userId: 2005, submittedOn: null, email: "ava.w@corp.com", status: "Pending" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const ResponseView = ({ formId, formName, onViewResponse, onExport }) => {
    // State to manage the two views: 'responses' or 'assignedByMe'
    const [viewMode, setViewMode] = useState('responses'); 
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    // **CRITICAL FIX 1: Select the data source correctly**
    const dataToDisplay = viewMode === 'responses' ? mockResponses : mockAssignedByMe;

    // Data filtering and pagination logic 
    const filteredData = useMemo(() => {
        // **CRITICAL FIX 2: Filter the dataToDisplay array, not just mockResponses**
        return dataToDisplay.filter(item =>
            item.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userId.toString().includes(searchTerm) ||
            (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, dataToDisplay]); // **CRITICAL FIX 3: Dependency includes dataToDisplay**

    const totalFilteredPages = Math.ceil(filteredData.length / itemsPerPage);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalFilteredPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = Number(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); 
    };

    const getRangeInfo = () => {
        if (filteredData.length === 0) return "0 records";
        const label = viewMode === 'responses' ? 'responses' : 'records';
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredData.length);
        return `Showing ${start}-${end} of ${filteredData.length} ${label}`;
    };

    const getColumns = () => {
        if (viewMode === 'responses') {
            return ["Submitted by", "User ID", "Submitted on", "Email", "Response"];
        } else { // assignedByMe
            return ["Submitted by", "User ID", "Submitted on", "Email", "Status", "Response"];
        }
    };
    
   // --- EMPTY STATE CHECK ---
   // Check if the current data source is empty AND the user hasn't typed a search term
   const isDataEmpty = dataToDisplay.length === 0 && searchTerm === "";
    
    // Determine the empty state message based on the view mode
    const getEmptyStateContent = () => {
        const title = viewMode === 'responses' ? 'No Responses Yet' : 'No Assignments Found';
        const message = viewMode === 'responses' 
            ? 'Once learners start submitting the form, their individual responses will appear here. You can view, filter, and analyze each submission in detail.'
            : 'You have not assigned this form to any learners yet. Use the "Assign Learners" option to track submissions here.';

        return (
            <section className="response-empty-state-container">
                <div className="empty-state">
                    
                    <div className="empty-image-wrapper">
                         {/* Using the standard image class for CSS stacking */}
                         <img src={noResponses} alt={title} className="empty-page-image layer-1" />
                         {/* Assuming noResponses2/3 are now part of a composite or removed. Using a wrapper for clean CSS centering. */}
                    </div>
                    
                    <div className='temp'>
                        <p className='temp1'>{title}</p>
                        <p className='temp2'>{message}</p>
                    </div>
                </div>
            </section>
        );
    };


    return (
        // Use a wrapper for the entire view (renamed from the redundant nested class)
        <div className="response-view-container">
            
            {/* 1. HEADER/TOGGLE BUTTONS (Always rendered) */}
            <div className="response-header-toolbar">
                <div className="toggle-group">
                    <button 
                        className={`toggle-btn ${viewMode === 'responses' ? 'active' : ''}`}
                        onClick={() => { setViewMode('responses'); setCurrentPage(1); setSearchTerm(''); }}
                    >
                        Responses
                    </button>
                    <button 
                        className={`toggle-btn ${viewMode === 'assignedByMe' ? 'active' : ''}`}
                        onClick={() => { setViewMode('assignedByMe'); setCurrentPage(1); setSearchTerm(''); }}
                    >
                        Assigned By Me
                    </button>
                </div>
            </div>

            {/* 2. CONDITIONAL CONTENT: Empty State OR Data View */}
            {isDataEmpty ? (
                // A. Empty State (Visible if current data source is empty and no search term)
                getEmptyStateContent()
            ) : (
                // B. Data View (Visible if data exists or user is searching)
                // Note: Renamed the class here to avoid conflict/redundancy with the wrapper class
                <div className="response-view-container">

                    {/* Toolbar: Search and Export */}
                    <div className="response-toolbar">
                        <div className="Response-search-bar-container">
                            <img src={Search} alt="Search" className="search-icon" />
                            <input
                                type="text"
                                placeholder={`Search records...`}
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="response-search-input"
                            />
                        </div>
                        
                        <button className="export-btn" onClick={() => onExport(viewMode)}>
                            Export to Excel
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="response-table-wrapper">
                        <table className="response-table">
                            <thead>
                                <tr>
                                    {getColumns().map((col, index) => (
                                        <th key={index}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.submitterName}</td>
                                        <td>{item.userId}</td>
                                        <td>{item.submittedOn || 'N/A'}</td>
                                        <td>{item.email}</td>

                                        {viewMode === 'assignedByMe' && (
                                            <td className="status-cell">
                                                <span className={`status-tag ${item.status ? item.status.toLowerCase() : 'pending'}`}>
                                                    {item.status || 'Pending'}
                                                </span>
                                            </td>
                                        )}
                    
                                        <td className="response-action">
                                            <button 
                                                className="view-btn" 
                                                onClick={() => onViewResponse(item.id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedData.length === 0 && (
                                    <tr>
                                        <td colSpan={getColumns().length} className="no-results">
                                            No records found for "{searchTerm}".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Row */}
                    <div className="pagination-row">
                        <div className="items-per-page-selector">
                            <span>Items per page:</span>
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="page-navigation">
                            
                            <span className="current-page-info">
                                <select 
                                        value={currentPage} 
                                        onChange={(e) => handlePageChange(Number(e.target.value))}
                                        
                                    >
                                    {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map(page => (
                                        <option key={page} value={page}>{page}</option>
                                    ))}
                                </select>
                                <span className='total-pages-display'>
                                    of {totalFilteredPages} pages
                                </span>
                            </span>

                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="nav-button"
                            >
                                &lt;
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                                className="nav-button"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

ResponseView.propTypes = {
    formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    formName: PropTypes.string.isRequired,
    onViewResponse: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired, 
};

export default ResponseView;