import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Provider } from 'react-redux' // 1. زيد هادي
import { store } from './app/store'   // 2. جيب الـ store ديالك
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. غلف App بـ Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)