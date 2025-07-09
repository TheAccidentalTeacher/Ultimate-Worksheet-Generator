'use client';

import React from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

interface APIErrorHandlerProps {
  error: string;
  service?: 'openai' | 'images' | 'general';
  onRetry?: () => void;
}

export default function APIErrorHandler({ error, service = 'general', onRetry }: APIErrorHandlerProps) {
  const getErrorMessage = () => {
    if (error.includes('API key')) {
      return {
        title: 'API Configuration Required',
        message: 'To use this feature, you need to configure your API keys.',
        solution: service === 'openai' 
          ? 'Add your OpenAI API key to get started with worksheet generation.'
          : 'Add image service API keys for enhanced visual content.',
        link: service === 'openai' 
          ? 'https://platform.openai.com/api-keys'
          : 'https://unsplash.com/developers'
      };
    }
    
    if (error.includes('quota') || error.includes('billing')) {
      return {
        title: 'API Quota Exceeded',
        message: 'Your API usage limit has been reached.',
        solution: 'Check your API billing dashboard or try again later.',
        link: 'https://platform.openai.com/account/billing'
      };
    }
    
    return {
      title: 'Service Temporarily Unavailable',
      message: error,
      solution: 'This is likely a temporary issue. Please try again in a few moments.',
      link: null
    };
  };

  const { title, message, solution, link } = getErrorMessage();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-4">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">{title}</h3>
          <p className="text-amber-700 mb-3">{message}</p>
          <p className="text-amber-600 text-sm mb-4">{solution}</p>
          
          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            )}
            
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Get API Key
              </a>
            )}
            
            <a
              href="/health"
              className="inline-flex items-center px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium"
            >
              Check System Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
