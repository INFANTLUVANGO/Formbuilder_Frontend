import React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
// Replaced import FaHome from 'react-icons/fa' with an inline SVG equivalent for compatibility
// import { FaHome } from 'react-icons/fa' 
import "../../Styles/Header.sass";

import Home from "../../assets/ic_round-home.png"
import Arrow from "../../assets/Alt Arrow Right.png"


// Home Icon SVG replacement for FaHome
const HomeIcon = (props) => (
    <img src={Home} alt=""  style={{width: 24,height: 24}}/>
    
);


// Accepts pageTitleOverride (the form name/title)
const Header = ({ pageTitleOverride }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const paths = location.pathname.split('/').filter(Boolean); // e.g., ['create', '123'] or ['preview', '123']
    

    const mainRoute = paths[0];
    const isPreviewPage = mainRoute === 'preview';

    // 2. 🔑 DEFINE handleGoBack SECOND
  const handleGoBack = () => {
    navigate(-1);
  };
    
    let baseTitle = '';
    let baseLinkPath = ''; // Path to link back to the editor (e.g., /create/123)
    
    // Map the known routes
    const routeMap = {
        'create': paths.length > 1 ? 'Edit Form' : 'Create Form',
        'view-form': 'View Form',
        'view-responses': 'ViewResponses',
        'preview': 'Edit Form'
    };

    baseTitle = routeMap[mainRoute] || '';

    // If we are on the preview page, the link back should be to /create/:formId
    if (isPreviewPage && paths.length > 1) {
        const formId = paths[1];
        baseLinkPath = `/create/${formId}`;
        baseTitle = 'Edit Form'; // Explicitly set base title for preview path
    } else {
        // For all other pages, the base link is the current path
        baseLinkPath = `/${paths.join('/')}`;
    }


    const crumbs = [
        <Link key="home" to="/" className="crumb home">
            <HomeIcon className="home-icon" />
        </Link>,
    ];

    if (paths.length > 0) {
        // 1. FormBuilder Crumb (Always present on sub-pages)
        crumbs.push(<img src={Arrow} alt=""  style={{width: 20}}/>);
        crumbs.push(<Link key="form" to="/" className="crumb">FormBuilder</Link>);

        // 2. Base Page Crumb (Create Form / Edit Form, etc.)
        if (baseTitle) {
            crumbs.push(<img src={Arrow} alt=""  style={{width: 24,height: 24}}/>);
            
            if (isPreviewPage) {
                // If on preview, link back to the base page (/create/:formId)
                crumbs.push(
                    <Link key="base" to={baseLinkPath} className="crumb">{baseTitle}</Link>
                );
            } else {
                // If on the editor/other page, this is the final active crumb
                crumbs.push(
                    <span key="base" className="crumb active">{baseTitle}</span>
                );
            }
        }
        
        // 3. 'Preview' Crumb (Only if applicable)
        if (isPreviewPage) {
            crumbs.push(<img src={Arrow} alt=""  style={{width: 24,height: 24}}/>);
            // This is the final active crumb for the preview page
            crumbs.push(<span key="preview" className="crumb active">Preview</span>);
        }

    } else {
        // Root path
        crumbs.push(<img src={Arrow} alt=""  style={{width: 24,height: 24}}/>);
        crumbs.push(<span key="form" className="crumb active">FormBuilder</span>);
    }

    // The prominent title appears only if we are on the preview page AND the form name is available.
    const isFormViewer = isPreviewPage && pageTitleOverride;
    
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
