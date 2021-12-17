import React, { useState } from 'react';
// import pdfUrl from '../../../../public/report.pdf';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function readPDF(){
    var reader = new FileReader();
    reader.readAsDataURL('./report2.js');
    
}
function MyApp() {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages, a, b }) {
    setNumPages(numPages);
    console.log(numPages);
    console.log(a);
    console.log(b);
    console.log(c.offsetLight);
    
  }

  return (
    <div >
      <Document
        file='/report2.pdf'
        onLoadSuccess={onDocumentLoadSuccess}     
      >
        {
            new Array(numPages).fill('').map((item,index)=>(
                <Page key={index} width={1000} pageNumber={index+1} />
            ))
        }
      </Document>
      {/* <p>Page {pageNumber} of {numPages}</p> */}
      <div>download</div>
    </div>
  );
}

export default MyApp;
