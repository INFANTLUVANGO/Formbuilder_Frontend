import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../Styles/Learner/MySubmission.sass"; // Use the Learner's SASS file
import Search from "../../assets/Search.png"; // Assuming Search icon is available

// --- MOCK DATA for LEARNER SUBMISSIONS ---
const mockLearnerSubmissions = [
    { 
        submissionId: 'SUB-201', formId: 101, formName: "Advanced Certification Workshop", 
        submittedOn: "Oct 15, 2025", assignedBy: "Sarah Connor (Admin)", 
        status: "Approved" 
    },
    { 
        submissionId: 'SUB-202', formId: 102, formName: "Professional Skills Development", 
        submittedOn: "Sep 10, 2025", assignedBy: "Kyle Reese (Manager)", 
        status: "Pending Review" 
    },
    { 
        submissionId: 'SUB-203', formId: 103, formName: "External Trainings Request", 
        submittedOn: "Aug 25, 2025", assignedBy: "T-800 (Admin)", 
        status: "Rejected" 
    },
    { 
        submissionId: 'SUB-204', formId: 104, formName: "Specialized Certification Training", 
        submittedOn: "Aug 01, 2025", assignedBy: "Sarah Connor (Admin)", 
        status: "Approved" 
    },
    // --- ADDITIONAL MOCK DATA ---
    { 
        submissionId: 'SUB-205', formId: 105, formName: "Team Leadership Workshop Registration", 
        submittedOn: "Jul 15, 2025", assignedBy: "John Doe (HR)", 
        status: "Approved" 
    },
    { 
        submissionId: 'SUB-206', formId: 106, formName: "Annual Performance Review Form", 
        submittedOn: "Jul 05, 2025", assignedBy: "Kyle Reese (Manager)", 
        status: "Pending Review" 
    },
    { 
        submissionId: 'SUB-207', formId: 107, formName: "New Software Training Request", 
        submittedOn: "Jun 28, 2025", assignedBy: "Sarah Connor (Admin)", 
        status: "Approved" 
    },
    { 
        submissionId: 'SUB-208', formId: 108, formName: "Mandatory Compliance Checklist", 
        submittedOn: "May 20, 2025", assignedBy: "T-800 (Admin)", 
        status: "Approved" 
    },
    { 
        submissionId: 'SUB-209', formId: 109, formName: "Skill Gap Assessment Survey", 
        submittedOn: "Apr 10, 2025", assignedBy: "John Doe (HR)", 
        status: "Rejected" 
    },
    { 
        submissionId: 'SUB-210', formId: 110, formName: "External Vendor Certification", 
        submittedOn: "Mar 01, 2025", assignedBy: "Kyle Reese (Manager)", 
        status: "Pending Review" 
    },
    { 
        submissionId: 'SUB-211', formId: 111, formName: "Data Security Policy Acknowledgment", 
        submittedOn: "Feb 14, 2025", assignedBy: "T-800 (Admin)", 
        status: "Approved" 
    },
    { 
        submissionId: 'SUB-212', formId: 112, formName: "Advanced Excel Modeling Course", 
        submittedOn: "Jan 05, 2025", assignedBy: "Sarah Connor (Admin)", 
        status: "Approved" 
    },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const MySubmission = () => {
    const navigate = useNavigate(); // Used for the "View" button action
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    // Data filtering and pagination logic 
    const filteredData = useMemo(() => {
        return mockLearnerSubmissions.filter(item =>
            item.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.assignedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.formId.toString().includes(searchTerm)
        );
    }, [searchTerm]);

    const totalFilteredPages = Math.ceil(filteredData.length / itemsPerPage);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    // --- Handlers ---

    const handleViewResponse = (formId, submissionId) => {
        // Navigates to the read-only view of the submitted form
        navigate(`/form/${formId}/view-response/${submissionId}`);
    };

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
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredData.length);
        return `Showing ${start}-${end} of ${filteredData.length} records`;
    };

    const getColumns = () => {
        // Columns: Form ID, Form Name, Submitted On, Assigned By, View Button
        return ["Form ID", "Form Name", "Submitted On", "Assigned By", "Response"]; // Last column is for the button
    };
    
    // Check if the current data source is empty AND the user hasn't typed a search term
    const isDataEmpty = mockLearnerSubmissions.length === 0 && searchTerm === "";

    return (
        <div className="sub-list-container">
            
            {/* 1. TOOLBAR: Search and Export */}
            <div className="sub-toolbar">
                <div className="search-bar-container">
                    <img src={Search} alt="Search" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by Form Name or Assigned By..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="sub-search-input"
                    />
                </div>
                
                <button className="export-btn">
                    Export to Excel
                </button>
            </div>

            {/* 2. CONDITIONAL CONTENT: Empty State OR Data View */}
            {isDataEmpty && !searchTerm ? (
                <div className="empty-state-container">
                    {/* Placeholder for a custom empty state component/content */}
                    <div className='empty-state-message'>
                        <p>No Submissions Found</p>
                        <p>You haven't submitted any forms yet.</p>
                    </div>
                </div>
            ) : (
                <div className="sub-table-wrapper">
                    <table className="sub-table">
                        <thead>
                            <tr>
                                {/* Use specific classes for column widths if needed in SASS */}
                                {getColumns().map((col, index) => (
                                    <th key={index}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item) => (
                                <tr key={item.submissionId}>
                                    <td>{item.formId}</td>
                                    <td>{item.formName}</td>
                                    <td>{item.submittedOn || 'N/A'}</td>
                                    <td>{item.assignedBy}</td>
                                    
                                    <td className="sub-action">
                                        <button 
                                            className="view-btn" 
                                            onClick={() => handleViewResponse(item.formId, item.submissionId)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={getColumns().length} className="no-results">
                                        No submissions found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Row */}
                    <div className="sub-pagination-row">
                        
                        {/* 1. Items per page selector (Left side) */}
                        <div className="items-per-page-selector items-box">
                            <span>Items per page</span>
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        

                        {/* 3. Page Navigation (Right side) */}
                        <div className="sub-page-navigation controls-box">
                            {/* "1 of 6 pages" control */}
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

                            {/* Navigation Buttons */}
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="nav-button prev-button"
                            >
                                &lt;
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                                className="nav-button next-button"
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

export default MySubmission;