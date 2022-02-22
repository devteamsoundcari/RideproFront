import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COMPANY_NAME } from '.';

export function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname) {
      const customPathName = pathname.slice(1);
      const str = `${COMPANY_NAME} - ${
        customPathName.charAt(0).toUpperCase() + customPathName.slice(1)
      }`;
      const str2 = str.charAt(0).toUpperCase() + str.slice(1);
      document.title = str2;
    }
  }, [pathname]);
}
