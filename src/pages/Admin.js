import React from 'react';

const Admin = () => {
  return (
    <div style={{ margin: 0, padding: 0, height: '100vh', width: '100vw', position: 'relative' }}>
      <h1 style={{ position: 'absolute', top: 10, left: 10, color: 'white', zIndex: 10 }}>
        Admin Dashboard
      </h1>
      <iframe
        title="Power BI Report"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/reportEmbed?reportId=3b417929-b8ea-4fc1-ba05-cd1654a07229&autoAuth=true&ctid=dbd6664d-4eb9-46eb-99d8-5c43ba153c61"
        frameBorder="0"
        allowFullScreen="true"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

export default Admin;
