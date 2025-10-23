import React from 'react'
import Header from './Header'
import "../../Styles/Layout.sass";

// Accepting a new prop to override the header display, typically the form's name
const Layout = ({ children, pageTitleOverride }) => {
  return (
    <div className="admin-dashboard">
      {/* Pass the override title to the Header component */}
      <Header pageTitleOverride={pageTitleOverride} />
      <main className="page-content">
        {children}
      </main>
    </div>
  )
}

export default Layout;
