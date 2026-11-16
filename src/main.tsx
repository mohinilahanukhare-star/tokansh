import React from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {AppProvider} from './app/context';
import App from './App';
import './styles.css';
const queryClient=new QueryClient({defaultOptions:{queries:{refetchOnWindowFocus:false,retry:1,staleTime:15000}}});
createRoot(document.getElementById('root')!).render(
 <React.StrictMode><QueryClientProvider client={queryClient}><HashRouter><AppProvider><App/></AppProvider></HashRouter></QueryClientProvider></React.StrictMode>
);
