import React, { createContext, useState } from 'react';
import ApiClientSingleton from '../controllers/apiClient';
import { API_ALL_DOCUMENTS } from '../utils';

export const DocumentsContext = createContext('' as any);

const apiClient = ApiClientSingleton.getApiInstance();

export const DocumentsContextProvider = (props) => {
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [allDocumentsLoaded, setAllDocumentsLoaded] = useState(false);
  const [count, setCount] = useState(0);

  const getDocuments = async (page?: string) => {
    setLoadingDocuments(true);
    if (page) {
      try {
        const response = await apiClient.get(page);
        setDocuments((oldArr: any) => [...oldArr, ...response.data.results]);
        if (response.data.next) {
          return await getDocuments(response.data.next);
        } else {
          setAllDocumentsLoaded(true);
          setLoadingDocuments(false);
        }
      } catch (error) {
        setDocuments(error);
        setLoadingDocuments(false);
      }
    } else {
      try {
        setDocuments([]);
        const response = await apiClient.get(API_ALL_DOCUMENTS);
        setCount(response.data.count);
        if (response.data.next) {
          return await getDocuments(response.data.next);
        } else {
          setAllDocumentsLoaded(true);
          setLoadingDocuments(false);
        }
      } catch (error) {
        setDocuments(error);
        setLoadingDocuments(false);
      }
    }
  };

  const createDocument = async (data: any) => {
    setLoadingDocuments(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    try {
      const res = await apiClient.post(API_ALL_DOCUMENTS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoadingDocuments(false);
      return res.data;
    } catch (error) {
      setLoadingDocuments(false);
      throw new Error('Error al registrar el documento');
    }
  };

  return (
    <DocumentsContext.Provider
      value={{
        loadingDocuments,
        documents,
        setDocuments,
        getDocuments,
        allDocumentsLoaded,
        setAllDocumentsLoaded,
        count,
        createDocument
      }}>
      {props.children}
    </DocumentsContext.Provider>
  );
};
