import { useEffect, useRef } from "react";

const useStickyScroll = (stickyTop = 67) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        if (rect.top <= stickyTop) {
          elementRef.current.classList.add(`stickyTop-${stickyTop}`);
        } else {
          elementRef.current.classList.remove(`stickyTop-${stickyTop}`);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stickyTop]);

  return elementRef;
};

export default useStickyScroll;
