import React, { useEffect, useState, useMemo } from 'react'
import FormCard from './FormCard'
import "../../Styles/Admin/AdminHome.sass";
import { useNavigate } from 'react-router-dom'
import EmptyPage from "../../assets/EmptyPage.png"
import Search from "../../assets/Search.png"
// Assuming these modal components exist and are correctly imported:
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
    const updatedForms = forms.filter(form => form.id.toString() !== formIdToDelete.toString());
    localStorage.setItem('forms', JSON.stringify(updatedForms));
};


export default function AdminHome () {
    // === STATE MANAGEMENT ===
    const [forms, setForms] = useState([]) // Forms displayed on the current page
    const [searchTerm, setSearchTerm] = useState(''); // 🔑 Search term state
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [openDropdownId, setOpenDropdownId] = useState(null)
    // 🔑 FIX 1: New state to trigger re-fetch/re-memoization after local data change
    const [localDataKey, setLocalDataKey] = useState(0);

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formToDelete, setFormToDelete] = useState(null);
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [formToToggle, setFormToToggle] = useState(null);
    const [targetVisibility, setTargetVisibility] = useState(null); // true/false
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [formToAssign, setFormToAssign] = useState(null);

    const navigate = useNavigate()

    // === DATA FILTERING AND PAGINATION MEMOIZATION ===
    const allForms = useMemo(() => {
        const userCreatedForms = getLocalForms();
      
        const combinedForms = [...userCreatedForms];

        if (!searchTerm) {
            return combinedForms;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        return combinedForms.filter(form => 
            // Filter by title or createdBy/publishedBy
            form.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            form.createdBy.toLowerCase().includes(lowerCaseSearchTerm) ||
            (form.publishedBy && form.publishedBy.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [searchTerm, localDataKey]); // Re-run when searchTerm changes

    const totalItems = allForms.length;
    const totalPagesMemo = Math.ceil(totalItems / PAGE_SIZE);

    // === EFFECT HOOK FOR FETCHING/PAGINATION ===
    useEffect(() => {
        setLoading(true);
        setTotalPages(totalPagesMemo);
        
        const start = (page - 1) * PAGE_SIZE;
        const pageItems = allForms.slice(start, start + PAGE_SIZE);
        
        // Adjust page if current page is now empty/out of bounds after search/deletion
        if (page > 1 && page > totalPagesMemo) {
            if (totalPagesMemo > 0) {
                 // Set to the last valid page
                 setPage(totalPagesMemo); 
                 return; // Exit, letting the setPage trigger the next effect run
            } else {
                 // If total pages is 0, stay on page 1 (which will be empty)
                 setPage(1); 
            }
        }

        // Simulate network delay and update state
        new Promise(r => setTimeout(r, 120)).then(() => {
            setForms(pageItems);
            setLoading(false);
        });

    }, [page, allForms, totalPagesMemo]); 


    // // === SEARCH HANDLER ===
    // const handleSearchChange = (e) => {
    //     const newSearchTerm = e.target.value;
    //     setSearchTerm(newSearchTerm);
    //     // Reset to page 1 whenever the search term changes
    //     setPage(1); 
    // };

    // === ACTION HANDLERS ===
    const handleCreate = () => navigate('/create')
    
    const handleEdit = (formId) => {
        navigate(`/create/${formId}`);
    };

    const handleDelete = (formId) => {
        const formToFind = forms.find(f => f.id === formId);
        if (formToFind) {
            setFormToDelete(formToFind);
            setShowDeleteModal(true);
            setOpenDropdownId(null); 
        }
    };
    
    // Deletion Logic: Must re-evaluate total pages and potentially jump page
    const confirmDelete = () => {
        setLoading(true);
        const formId = formToDelete.id;
        deleteFormFromLocal(formId);
        // 🔑 CRITICAL FIX: Increment the key to force the data to re-fetch/re-memoize
        setLocalDataKey(prevKey => prevKey + 1);
        setShowDeleteModal(false);
        setFormToDelete(null); 

        // Rerunning the effect hook takes care of re-fetching the data correctly
        // by updating the dependencies (allForms changes because Local Storage changed).
        // No manual page calculation needed here, useEffect handles it.
        // We set loading false inside the useEffect to ensure proper sequencing.
    };

    const handleAssignLearners = (formId) => {
        const formToFind = forms.find(f => f.id === formId);
        if (formToFind) {
            setFormToAssign(formToFind);
            setShowAssignModal(true);
            setOpenDropdownId(null); 
        }
    };
    
    const confirmAssignLearners = (formId, learnerIds) => {
        console.log(`Form ID ${formId} assigned to ${learnerIds.length} learners:`, learnerIds);
        alert(`Successfully assigned form to ${learnerIds.length} learners.`);
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
    
    const confirmToggleVisibility = async (formId, newVisibility) => {
      setLoading(true);
      updateFormVisibilityInLocal(formId, newVisibility);
      // 🔑 CRITICAL FIX: Increment the key to force the data to re-fetch/re-memoize
      setLocalDataKey(prevKey => prevKey + 1);
      
      setShowVisibilityModal(false);
      setFormToToggle(null);
      setTargetVisibility(null);

      // Rerunning the effect hook handles the refresh
    };

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null)
        if (!showDeleteModal && !showVisibilityModal && !showAssignModal) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [showDeleteModal, showVisibilityModal, showAssignModal])

    // === PAGINATION HANDLERS ===
    const goPrev = () => { if (page > 1) setPage(page - 1) }
    const goNext = () => { if (page < totalPages) setPage(page + 1) }
    const goto = (n) => { if (n >= 1 && n <= totalPages) setPage(n) }

    const isModalActive = showDeleteModal || showVisibilityModal || showAssignModal;

    // Check if there are no forms and no search term applied
    //const isEmpty = !loading && forms.length === 0 && searchTerm === ""; 
    const isEmpty=false;

    return (

        isEmpty ? (

        <section className="empty-state-container">
            <div className="empty-state">
                <img src={EmptyPage} alt="No Forms Found" className="empty-page-image" />
                <div className='temp'>
                    <p className='temp1'>Create a Form Templete</p>
                    <p className='temp2'>Create templates that can be used in various other features.</p>
                    <button className="create-btn-lg" onClick={() => {
                        handleCreate();
                        setSearchTerm(''); 
                    }}>
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
                                disabled={isModalActive} 
                                value={searchTerm} // 🔑 BIND STATE
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="create-btn" onClick={handleCreate} disabled={isModalActive}>Create Form</button>
                    </div>
                </div>

                <div className="forms-container">
                  {loading ? (
                      // 1. Loading State
                      <div className="loading">Loading...</div>
                  ) : (
                      // 2. Content Loaded
                      <>
                          {forms.map(f => (
                              <FormCard
                                  key={f.id}
                                  form={f}
                                  openDropdownId={openDropdownId}
                                  setOpenDropdownId={setOpenDropdownId}
                                  handleEdit={handleEdit}
                                  handleToggleVisibility={handleToggleVisibility}
                                  handleDelete={handleDelete}
                                  handleAssignLearners={handleAssignLearners}
                                  disabled={isModalActive} 
                              />
                          ))}
                          
                          {/* 3. Empty State / No Results Message */}
                          {forms.length === 0 && (
                              <p className="empty-message">No matching forms currently available.</p>
                          )}
                      </>
                  )}
              </div>
                
                {/* 🔑 Pagination is hidden if only one page exists */}
               
                    <div className="pagination">
                        <button className="page-btn" onClick={goPrev} disabled={page === 1 || isModalActive}>Prev</button>
                        {Array.from({ length: totalPagesMemo }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                className={`page-number ${n === page ? 'active' : ''}`}
                                onClick={() => goto(n)}
                                disabled={isModalActive}
                            >{n}</button>
                        ))}
                        <button className="page-btn" onClick={goNext} disabled={page === totalPagesMemo || isModalActive}>Next</button>
                    </div>
                
            </section>
        </>
        )
    )
}