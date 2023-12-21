import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import store from "./Redux/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient({});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
     <Provider store={store}>
          <QueryClientProvider client={queryClient}>
               <HashRouter>
                    <App />
               </HashRouter>
               <ReactQueryDevtools />
          </QueryClientProvider>
     </Provider>
);

