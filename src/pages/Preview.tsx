
import React from 'react';
import Layout from '@/components/Layout';
import ReturnAssistant from '@/components/ReturnAssistant';

const Preview: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gradient-primary">Return Assistant Preview</h1>
          <p className="text-muted-foreground">
            Use our AI assistant to manage your returns quickly and easily
          </p>
          <p className="text-muted-foreground mt-2 text-blue-400">
            Made by Reg.No.: 12309075
          </p>
        </div>
        
        <ReturnAssistant />
      </div>
    </Layout>
  );
};

export default Preview;
