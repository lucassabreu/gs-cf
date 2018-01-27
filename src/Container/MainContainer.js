import React from 'react'

const MainContainer = ({ children }) => (
  <div className="container-fluid">
    <div className="row justify-content-center">
      <main className="col-10 pt-3" role="main">
        <section className="row">
          {children}
        </section>
      </main>
    </div>
  </div>
)

export default MainContainer 
