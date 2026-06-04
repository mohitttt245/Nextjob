import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | NextJob Portal` : "NextJob Portal";
  }, [title]);
};

export default useDocumentTitle;
