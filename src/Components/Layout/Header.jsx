import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
// Note: Keeping original imports, assuming these assets are resolvable in your final environment
import "../../Styles/Layout/Header.sass"; 
import Home from "../../assets/ic_round-home.png"
import Arrow from "../../assets/Alt Arrow Right.png"


// Home Icon SVG replacement for FaHome
const HomeIcon = (props) => (
    <img src={Home} alt=""  style={{width: 24,height: 24}}/>
);


// Accepts pageTitleOverride (the form name/title)
const Header = ({ pageTitleOverride }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const paths = location.pathname.split('/').filter(Boolean); // e.g., ['create', '123'] or ['learner', 'submit', '123']
    
    // --- CONTEXT DETECTION ---
    const isLearnerRoute = paths[0] === 'learner';
    const rootLinkPath = isLearnerRoute ? '/learner' : '/';
    const rootBreadcrumbText = isLearnerRoute ? 'Forms' : 'FormBuilder';

    const mainRoute = paths[0];
    const isPreviewPage = mainRoute === 'preview';

    // 2. 🔑 DEFINE handleGoBack SECOND
    const handleGoBack = () => {
        navigate(-1);
    };
    
    let baseTitle = '';
    let baseLinkPath = ''; // Path to link back to the editor (e.g., /create/123)
    
    // Map the known routes (Combined Admin and Learner sub-routes)
    const routeMap = {
        // Admin Routes
        'create': paths.length > 1 ? 'Edit Form' : 'Create Form',
        'view-form': 'View Form',
        'view-responses': 'View Responses',
        'preview': 'Edit Form',
        // Learner Sub-Routes (only used if isLearnerRoute is true)
        'submit': 'Submit Form',
    };

    let finalCrumbTitle = '';
    
    if (isLearnerRoute) {
        // Handle Learner Routes
        const subRoute = paths[1];
        
        if (!subRoute) {
            baseTitle = rootBreadcrumbText; 
            baseLinkPath = rootLinkPath;
        } else {
            baseTitle = routeMap[subRoute] || '';

            // Handle deep routes like /learner/submit/:formId
            if (paths.length > 2) {
                finalCrumbTitle = baseTitle; 
                baseTitle = rootBreadcrumbText; 
                baseLinkPath = rootLinkPath; 
            } else {
                baseLinkPath = `/learner/${subRoute}`;
            }
        }

    } else {
        // Handle Admin Routes (Original Logic)
        baseTitle = routeMap[mainRoute] || '';

        // If we are on the preview page, the link back should be to /create/:formId
        if (isPreviewPage && paths.length > 1) {
            const formId = paths[1];
            baseLinkPath = `/create/${formId}`;
            baseTitle = 'Edit Form'; 
            finalCrumbTitle = 'Preview';
        } else {
            baseLinkPath = `/${paths.join('/')}`;
        }
    }


    const crumbs = [
        <Link key="home" to={rootLinkPath} className="crumb home">
            <HomeIcon className="home-icon" />
        </Link>,
    ];

    
    const isAtDashboardRoot = paths.length === 0 || 
                              (paths.length === 1 && paths[0] === 'learner');

    if (paths.length > 0 || isAtDashboardRoot) {
        
        // --- 1. Root Crumb (FormBuilder or Forms) ---
        crumbs.push(<img src={Arrow} alt="" style={{width: 20}}/>);
        
        if (isAtDashboardRoot && paths.length <= 1) {
            // Path is exactly / or /learner. This is the final and active crumb.
            crumbs.push(<span key="form-root" className="crumb active">{rootBreadcrumbText}</span>);
        } else {
            // Path is deeper (e.g., /create/123 or /learner/submit). Root is a link.
            crumbs.push(<Link key="form-root" to={rootLinkPath} className="crumb">{rootBreadcrumbText}</Link>);
        }

        // --- 2. Base Page Crumb (Create Form / Edit Form, Submit Form, My Responses) ---
        if (!isAtDashboardRoot || paths.length > 1) {
            
            crumbs.push(<img src={Arrow} alt=""  style={{width: 24,height: 24}}/>);
            
            if (finalCrumbTitle) {
                // If we have a dedicated final crumb (like Preview), the base title links back
                crumbs.push(
                    <Link key="base" to={baseLinkPath} className="crumb">{baseTitle}</Link>
                );
            } else {
                // If this is the final page (e.g., /create/:id, /learner/submit)
                crumbs.push(
                    <span key="base" className="crumb active">{baseTitle}</span>
                );
            }
        }
        
        // --- 3. Final Crumb (Preview or specific form view) ---
        if (finalCrumbTitle) {
            crumbs.push(<img src={Arrow} alt=""  style={{width: 24,height: 24}}/>);
            // This is the final active crumb 
            crumbs.push(<span key="preview" className="crumb active">{finalCrumbTitle}</span>);
        }

    } else {
        // Fallback for root path (Should be covered by isAtDashboardRoot but kept for safety)
        crumbs.push(<img src={Arrow} alt=""  style={{width: 24,height: 24}}/>);
        crumbs.push(<span key="form-root" className="crumb active">FormBuilder</span>);
    }

    // The prominent title appears only on viewer pages 
    const isFormViewer = (isPreviewPage || (isLearnerRoute && paths.length > 2)) && pageTitleOverride;
    
    return (
        // Apply 'viewer-header' class when showing the form title
        <header className={`app-header ${isFormViewer ? 'viewer-header' : ''}`}>
            {isFormViewer ? (
                // New header style for Preview/Learner views (prominent form name)
                <div className="form-viewer-title">
                    <button 
                        onClick={handleGoBack} // Use the received navigation handler
                        className="back-icon-btn" 
                        aria-label="Go Back"
                    >
                        {/* Added stroke="#262626" to ensure visibility if CSS color isn't applied */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div className="title-text">{pageTitleOverride}</div>
                </div>
            ) : (
                // Original header style for Editor/Admin views (breadcrumbs)
                <div className="header-left">
                    <div className="breadcrumbs">{crumbs}</div>
                </div>
            )}
        </header>
    );
};

export default Header;