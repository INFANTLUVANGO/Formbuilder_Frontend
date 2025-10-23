import React, { useEffect, useState } from 'react'
import FormCard from './FormCard'
import "../../Styles/AdminHome.sass";
import { useNavigate } from 'react-router-dom'

const PAGE_SIZE = 9

// Helper function to safely get all forms from Local Storage
const getLocalForms = () => {
    const formsJson = localStorage.getItem('forms');
    return formsJson ? JSON.parse(formsJson) : []; 
};

// Helper function to delete a form from Local Storage
const deleteFormFromLocal = (formIdToDelete) => {
    let forms = getLocalForms();
    // Use toString() to ensure comparison works whether formId is number (Date.now()) or string
    const updatedForms = forms.filter(form => form.id.toString() !== formIdToDelete.toString());
    
    // Save the new array back to Local Storage
    localStorage.setItem('forms', JSON.stringify(updatedForms));
};

const generateSample = (total) => {
    const arr = []
    for (let i = 1; i <= total; i++) {
        // Unique ID prefix for samples (high number to avoid collision with Date.now() IDs)
        const base = { id: i + 1000000, createdBy: 'System', createdDate: 'Jan 01, 2025' };
        if (i % 3 === 0) {
            arr.push({
                ...base,
                title: `Resource Access Request ${i}`,
                status: 'published',
                publishedBy: 'Karan Patel',
                publishedDate: 'May 20, 2025'
            })
        } else if (i % 2 === 0) {
            arr.push({
                ...base,
                title: `Internal Transfer Request ${i}`,
                status: 'draft',
                createdBy: 'Saanvi Reddy',
                createdDate: 'May 08, 2025'
            })
        } else {
            arr.push({
                ...base,
                title: `Employee Onboarding ${i}`,
                status: 'published',
                publishedBy: 'Aarav Sharma',
                publishedDate: 'Apr 25, 2025'
            })
        }
    }
    return arr
}

export default function AdminHome () {
    const [forms, setForms] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [openDropdownId, setOpenDropdownId] = useState(null)

    const fetchForms = async (pageNumber) => {
        setLoading(true)

        const userCreatedForms = getLocalForms();
        const sampleForms = generateSample(23);
        const allForms = [...userCreatedForms, ...sampleForms]; // User forms appear first

        const start = (pageNumber - 1) * PAGE_SIZE
        const pageItems = allForms.slice(start, start + PAGE_SIZE)
        
        await new Promise(r => setTimeout(r, 120)) // Simulate network delay

        setForms(pageItems)
        // FIX: Ensure you use allForms.length here
        setTotalPages(Math.ceil(allForms.length / PAGE_SIZE)) 
        setLoading(false)
    }

    useEffect(() => { fetchForms(page) }, [page])

    const navigate = useNavigate()
    const handleCreate = () => navigate('/create')
    
    // Handler for editing (navigates to the /create/:formId route)
    const handleEdit = (formId) => {
        navigate(`/create/${formId}`);
    };

    // Handler for deleting a form
    const handleDelete = (formId) => {
        if (window.confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
            setLoading(true);
            deleteFormFromLocal(formId);
            // Re-fetch the current page to update the UI and pagination count
            fetchForms(page); 
            setOpenDropdownId(null); // Close the dropdown menu
        }
    };


    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null)
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const goPrev = () => { if (page > 1) setPage(page - 1) }
    const goNext = () => { if (page < totalPages) setPage(page + 1) }
    const goto = (n) => { if (n >= 1 && n <= totalPages) setPage(n) }

    return (
        <section className="admin-home">
            <div className="home-header">
                <h2>Form List</h2>
                <div className="right-actions">
                    <input className="search" placeholder="Search forms" />
                    <button className="create-btn" onClick={handleCreate}>Create Form</button>
                </div>
            </div>

            <div className="forms-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    forms.map(f => (
                        <FormCard
                            key={f.id}
                            form={f}
                            openDropdownId={openDropdownId}
                            setOpenDropdownId={setOpenDropdownId}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete} // Pass delete handler
                        />
                    ))
                )}
            </div>

            <div className="pagination">
                <button className="page-btn" onClick={goPrev} disabled={page === 1}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                        key={n}
                        className={`page-number ${n === page ? 'active' : ''}`}
                        onClick={() => goto(n)}
                    >{n}</button>
                ))}
                <button className="page-btn" onClick={goNext} disabled={page === totalPages}>Next</button>
            </div>
        </section>
    )
}