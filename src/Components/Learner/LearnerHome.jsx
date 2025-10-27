// Components/Learner/LearnerHome.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Layout from '../../Layout/Layout'; // ❌ REMOVED: Parent component manages Layout
import LearnerFormCard from './LearnerFormCard'; 
import MyResponses from './MySubmission';      
import "../../Styles/Learner/LearnerHome.sass"; 
// Assuming you have an image asset for the search icon
import Search from "../../assets/Search.png"; 

// Helper function to generate sample data structured for the Learner View
const generateLearnerSampleForms = () => {
    return [
        {
            id: 201, 
            title: "Professional Certificate Training", 
            description: "Request approval for external professional training development courses and certifications.",
            headerName: "Training Needs Form", 
            dueDate: "Aug 25, 2025",
            status: 'assigned' 
        },
        {
            id: 202, 
            title: "Professional Skills Development", 
            description: "Request approval for attending workshops and obtaining certifications to enhance career.",
            headerName: "External Training Completion",
            dueDate: "Sep 10, 2025",
            status: 'assigned'
        },
        {
            id: 203, 
            title: "Advanced Certification Workshop", 
            description: "Apply for permission to enroll in external workshops and certification programs.",
            headerName: "External Training Request & Completion",
            dueDate: "Oct 15, 2025",
            status: 'assigned'
        },
        // ... (rest of your form data)
    ];
};

export default function LearnerHome() {
    const [activeTab, setActiveTab] = useState('forms'); 
    const [searchTerm, setSearchTerm] = useState('');
    const allForms = generateLearnerSampleForms();

    // Filter logic for the 'forms' tab
    const formsForSubmission = allForms
        .filter(form => 
            form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Handler to switch the tab state
    const handleMySubmissionsClick = () => {
        setActiveTab('submissions');
    };

    return (
        // 🔑 The main container now manages the view without relying on a parent Layout for framing
        <section className="learner-home-container">
            
            {/* 🌟 1. TABS: Always visible at the top of the container */}
            <div className="learner-tabs">
                <div 
                    className={`tab ${activeTab === 'forms' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('forms');
                        setSearchTerm(''); // Clear search when switching tabs
                    }}
                >
                    Forms
                </div>
                <div 
                    className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
                    onClick={handleMySubmissionsClick}
                >
                    My Submission
                </div>
            </div>


            <div className="learnersub">
                    {activeTab === 'submissions' && (
                    <MyResponses /> 
                )}
            </div>
            
            {/* 🌟 2. CONTENT AREA: Renders one component based on the activeTab */}
            <div className="learner-tab-content">
                
                {/* --- Content for Self-Service Forms (Grid View) --- */}
                {activeTab === 'forms' && (
                    <div className="forms-view">
                        
                        {/* Header Row: Banner (Left) and Search (Right) */}
                        <div className="forms-header">
                            <div className="info-banner">
                                {/* Info icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                <span>These forms are optional and can be submitted multiple times if needed.</span>
                            </div>

                            <div className="learner-search-box">
                                <img src={Search} alt="" className='search-icon' /> 
                                <input 
                                    className="search-input"
                                    placeholder="Search" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Form Card Grid */}
                        <div className="forms-grid">
                            {formsForSubmission.map(form => (
                                <LearnerFormCard key={form.id} form={form} />
                            ))}
                            {formsForSubmission.length === 0 && (
                                <p className="empty-message">No matching forms currently available.</p>
                            )}
                        </div>
                    </div>
                )}
                
            </div>
            {/* --- Content for My Submission (List View) --- */}
            
        </section>
    );
}