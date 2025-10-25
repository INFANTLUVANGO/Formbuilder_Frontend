import React, { useEffect, useState } from 'react'
import FormCard from './FormCard'
import "../../Styles/AdminHome.sass";
import { useNavigate } from 'react-router-dom'
import EmptyPage from "../../assets/EmptyPage.png"
import Search from "../../assets/Search.png"
import DeleteFormModal from './DeleteFormModal';
import ToggleVisibilityModal from './ToggleVisibilityModal';
import AssignLearnersModal from './AssignLearnersModal';

const PAGE_SIZE = 9

// Helper function to safely get all forms from Local Storage
const getLocalForms = () => {
  const formsJson = localStorage.getItem('forms');
  return formsJson ? JSON.parse(formsJson) : []; 
};

const updateFormVisibilityInLocal = (formIdToUpdate, newVisibility) => {
    let forms = getLocalForms();
    const updatedForms = forms.map(form => 
        form.id.toString() === formIdToUpdate.toString()
            ? { ...form, formVisibility: newVisibility } 
            : form
    );
    localStorage.setItem('forms', JSON.stringify(updatedForms));
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
  // ... (sample generation function remains the same)
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);


  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [formToToggle, setFormToToggle] = useState(null);
  const [targetVisibility, setTargetVisibility] = useState(null); // true/false

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formToAssign, setFormToAssign] = useState(null);

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

    // 🌟 NEW HANDLER FUNCTION
    // const handleToggleVisibility = async (formId, currentVisibility) => {
    //     setLoading(true);
    //     setOpenDropdownId(null); 
        
    //     const newVisibility = currentVisibility;
        
    //     // 1. Update visibility in Local Storage
    //     updateFormVisibilityInLocal(formId, newVisibility);
        
    //     // 2. Refresh the current page view
    //     await fetchForms(page); 
        
    //     setLoading(false);
    // };

    const handleAssignLearners = (formId) => {
        const formToFind = forms.find(f => f.id === formId);
        if (formToFind) {
            setFormToAssign(formToFind);
            setShowAssignModal(true);
            setOpenDropdownId(null); // Close the action dropdown
        }
    };
    
    // 💡 FINAL ASSIGNMENT LOGIC
    const confirmAssignLearners = (formId, learnerIds) => {
        // You would typically make an API call here to assign the form/content
        console.log(`Form ID ${formId} assigned to ${learnerIds.length} learners:`, learnerIds);
        alert(`Successfully assigned form to ${learnerIds.length} learners.`);
        
        // Close modal and clear state
        setShowAssignModal(false);
        setFormToAssign(null);
    };

    const handleToggleVisibility = (formId, newVisibility) => {
      const formToFind = forms.find(f => f.id === formId);
      if (formToFind) {
          setFormToToggle(formToFind);
          setTargetVisibility(newVisibility);
          setShowVisibilityModal(true);
          setOpenDropdownId(null); 
      }
    };
    
    // 🌟 FINAL VISIBILITY CHANGE LOGIC (Confirmed)
    const confirmToggleVisibility = async (formId, newVisibility) => {
      setLoading(true);
      updateFormVisibilityInLocal(formId, newVisibility);
      
      // Clear modal state
      setShowVisibilityModal(false);
      setFormToToggle(null);
      setTargetVisibility(null);

      // Refresh the current page view
      await fetchForms(page); 
      setLoading(false);
    };




  useEffect(() => { fetchForms(page) }, [page])

  const navigate = useNavigate()
  const handleCreate = () => navigate('/create')
  
  // Handler for editing (navigates to the /create/:formId route)
  const handleEdit = (formId) => {
    navigate(`/create/${formId}`);
  };


  // Handler for deleting a form
  const handleDelete = (formId) => {
    const formToFind = forms.find(f => f.id === formId);
    if (formToFind) {
      setFormToDelete(formToFind);
      setShowDeleteModal(true);
      setOpenDropdownId(null); // Close the action dropdown
    }
  };

  // 🌟 Final deletion logic executed by the modal's confirm button
  const confirmDelete = (formId) => {
    setLoading(true);
    deleteFormFromLocal(formId);
    
    // After deletion, close modal, clear state, and refresh the current page
    setShowDeleteModal(false);
    setFormToDelete(null); 

    const remainingForms = getLocalForms().length + generateSample(23).length;
    const newTotalPages = Math.ceil(remainingForms / PAGE_SIZE);
    let targetPage = page;

    if (page > 1 && page > newTotalPages) {
      targetPage = newTotalPages;
      setPage(newTotalPages); // This triggers a re-fetch in useEffect
    } else {
      fetchForms(page); // Re-fetch the current page content
    }
  };


  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null)
    if (!showDeleteModal && !showVisibilityModal && !showAssignModal) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDeleteModal, showVisibilityModal, showAssignModal])

  const goPrev = () => { if (page > 1) setPage(page - 1) }
  const goNext = () => { if (page < totalPages) setPage(page + 1) }
  const goto = (n) => { if (n >= 1 && n <= totalPages) setPage(n) }

  const isModalActive = showDeleteModal || showVisibilityModal || showAssignModal;

  //const isEmpty = !loading && forms.length === 0 && totalPages === 1;
  const isEmpty = false;
    return (

        isEmpty ? (

        <section className="empty-state-container">
            <div className="empty-state">
                <img src={EmptyPage} alt="No Forms Found" className="empty-page-image" />
                <div className='temp'>
                    <p className='temp1'>Create a Form Templete</p>
                    <p className='temp2'>Create templates that can be used in various other features.</p>
                    <button className="create-btn-lg" onClick={handleCreate}>
                        Create Form
                    </button>
                </div>
            </div>
        </section>

        ) : (

        <>
            {/* 🌟 MODAL RENDERING */}
            {showDeleteModal && formToDelete && (
                <DeleteFormModal
                    form={formToDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                />
            )}

            {/* 🌟 NEW VISIBILITY MODAL RENDERING */}
            {showVisibilityModal && formToToggle && targetVisibility !== null && (
                <ToggleVisibilityModal
                    form={formToToggle}
                    newVisibility={targetVisibility}
                    onCancel={() => setShowVisibilityModal(false)}
                    onConfirm={confirmToggleVisibility}
                />
            )}

            {showAssignModal && formToAssign && (
                    <AssignLearnersModal
                        form={formToAssign}
                        onCancel={() => setShowAssignModal(false)}
                        onConfirm={confirmAssignLearners}
                    />
            )}
            
            <section className={`admin-home ${isModalActive ? 'modal-active' : ''}`}> 
                <div className="home-header">
                    <h2>Form List</h2>
                    <div className="right-actions">
                        <div className="search-box">
                            <img src={Search} alt="Search" className="search-icon" />
                            <input 
                                className="search-input"
                                placeholder="Search forms" 
                                disabled={isModalActive} // Disable input when modal is active
                            />
                        </div>
                        <button className="create-btn" onClick={handleCreate} disabled={isModalActive}>Create Form</button>
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
                                handleToggleVisibility={handleToggleVisibility}
                                handleDelete={handleDelete}
                                handleAssignLearners={handleAssignLearners}
                                disabled={isModalActive} // Pass disabled state to FormCard
                            />
                        ))
                    )}
                </div>

                <div className="pagination">
                    <button className="page-btn" onClick={goPrev} disabled={page === 1 || isModalActive}>Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            className={`page-number ${n === page ? 'active' : ''}`}
                            onClick={() => goto(n)}
                            disabled={isModalActive}
                        >{n}</button>
                    ))}
                    <button className="page-btn" onClick={goNext} disabled={page === totalPages || isModalActive}>Next</button>
                </div>
            </section>
        </>
        )
    )
}