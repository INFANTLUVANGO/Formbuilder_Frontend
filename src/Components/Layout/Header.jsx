import React from 'react'
import { Link, useLocation } from 'react-router-dom'
// Replaced import FaHome from 'react-icons/fa' with an inline SVG equivalent for compatibility
// import { FaHome } from 'react-icons/fa' 
import "../../Styles/Header.sass";

// Home Icon SVG replacement for FaHome
const HomeIcon = (props) => (
    <svg 
        {...props} 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        style={{ width: '1em', height: '1em', verticalAlign: 'middle' }}
    >
        <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5zM12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
    </svg>
);

// Accepts pageTitleOverride (the form name/title)
const Header = ({ pageTitleOverride }) => {
    const location = useLocation();
    const paths = location.pathname.split('/').filter(Boolean); // e.g., ['create', '123'] or ['preview', '123']
    
    // 🎯 Identify the main page route and if we are in preview mode
    const mainRoute = paths[0];
    const isPreviewPage = mainRoute === 'preview';
    
    // Determine the title for the first crumb (the editor/main page)
    let baseTitle = '';
    let baseLinkPath = ''; // Path to link back to the editor (e.g., /create/123)
    
    // Map the known routes
    const routeMap = {
        'create': paths.length > 1 ? 'Edit Form' : 'Create Form',
        'assign-learner': 'AssignLearner',
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
        crumbs.push(<span key="sep1" className="sep">›</span>);
        crumbs.push(<Link key="form" to="/" className="crumb">FormBuilder</Link>);

        // 2. Base Page Crumb (Create Form / Edit Form, etc.)
        if (baseTitle) {
            crumbs.push(<span key="sep2" className="sep">›</span>);
            
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
            crumbs.push(<span key="sep3" className="sep">›</span>);
            // This is the final active crumb for the preview page
            crumbs.push(<span key="preview" className="crumb active">Preview</span>);
        }

    } else {
        // Root path
        crumbs.push(<span key="sep" className="sep">›</span>);
        crumbs.push(<span key="form" className="crumb active">FormBuilder</span>);
    }

    // Determine which header content to show: the prominent title (for preview/submit view) or the breadcrumbs (for editor/admin view).
    // The prominent title appears only if we are on the preview page AND the form name is available.
    const isFormViewer = isPreviewPage && pageTitleOverride;
    
    return (
        // Apply 'viewer-header' class when showing the form title
        <header className={`app-header ${isFormViewer ? 'viewer-header' : ''}`}>
            {isFormViewer ? (
                // New header style for Preview/Learner views (prominent form name)
                <div className="form-viewer-title">
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
