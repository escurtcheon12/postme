import React from "react";
import { CFooter } from "@coreui/react";

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className="mfs-auto">
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Postme
        </a>
        <span className="ml-1">&copy; 2023.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
