// ResponseView.jsx

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import "../../../Styles/CreateForm/ResponseView.sass" 
import Search from "../../../assets/Search.png"

// --- MOCK DATA ---
const mockResponses = [
    { id: 201, submitterName: "Alice Johnson", userId: 1001, submittedOn: "2025-10-20", email: "alice.j@corp.com", status: "Submitted" },
    { id: 202, submitterName: "Bob Smith", userId: 1002, submittedOn: "2025-10-18", email: "bob.s@corp.com", status: "Submitted" },
    { id: 203, submitterName: "Charlie Brown", userId: 1003, submittedOn: null, email: "charlie.b@corp.com", status: "Pending" },
    { id: 204, submitterName: "Diana Prince", userId: 1004, submittedOn: "2025-10-15", email: "diana.p@corp.com", status: "Submitted" },
    { id: 205, submitterName: "Ethan Hunt", userId: 1005, submittedOn: null, email: "ethan.h@corp.com", status: "Pending" },
    { id: 206, submitterName: "Fiona Glenn", userId: 1006, submittedOn: "2025-10-10", email: "fiona.g@corp.com", status: "Submitted" },
    { id: 207, submitterName: "George Harrison", userId: 1007, submittedOn: null, email: "george.h@corp.com", status: "Pending" },
    { id: 208, submitterName: "Holly Golightly", userId: 1008, submittedOn: "2025-10-05", email: "holly.g@corp.com", status: "Submitted" },
    { id: 209, submitterName: "Ivan Drago", userId: 1009, submittedOn: null, email: "ivan.d@corp.com", status: "Pending" },
    { id: 210, submitterName: "Jasmine Kaur", userId: 1010, submittedOn: "2025-10-01", email: "jasmine.k@corp.com", status: "Submitted" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const ResponseView = ({ formId, formName, onViewResponse, onExport }) => {
    // State to manage the two views: 'responses' or 'assignedByMe'
    const [viewMode, setViewMode] = useState('responses'); 
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    // Data filtering and pagination logic (same as previous)
    const filteredData = useMemo(() => {
        return mockResponses.filter(item =>
            item.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userId.toString().includes(searchTerm) ||
            (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

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
    
    return (
        // The main container for this view
        <div className="response-view-container">
            
            {/* 1. Header: Toggle Buttons */}
            <div className="response-header-toolbar">
                <div className="toggle-group">
                    <button 
                        className={`toggle-btn ${viewMode === 'responses' ? 'active' : ''}`}
                        onClick={() => setViewMode('responses')}
                    >
                        Responses
                    </button>
                    <button 
                        className={`toggle-btn ${viewMode === 'assignedByMe' ? 'active' : ''}`}
                        onClick={() => setViewMode('assignedByMe')}
                    >
                        Assigned By Me
                    </button>
                </div>
            </div>

            {/* 2. Toolbar: Search and Export */}
            <div className="response-toolbar">
                <div className="search-bar-container">
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

            {/* 3. Data Table */}
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

            {/* 4. Pagination Row */}
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
                    <span className="current-page-info">{getRangeInfo()}</span>
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
    );
};

ResponseView.propTypes = {
    formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    formName: PropTypes.string.isRequired,
    onViewResponse: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired, 
};

export default ResponseView;