import React, { useState } from 'react';
// import pdfUrl from '../../../../public/report.pdf';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function MyApp() {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file='/report.pdf'
        onLoadSuccess={onDocumentLoadSuccess}     
      >
        {
            new Array(numPages).fill('').map((item,index)=>(
                <Page key={index} width={1000} pageNumber={index+1} />
            ))
        }
      </Document>
      {/* <p>Page {pageNumber} of {numPages}</p> */}
    </div>
  );
}

export default MyApp;
