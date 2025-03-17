
import React from 'react';
import Layout from '@/components/Layout';
import ReturnAssistant from '@/components/ReturnAssistant';

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center justify-center p-1 px-3 mb-6 border border-primary/20 rounded-full bg-primary/5 text-xs font-medium text-primary animate-fade-in">
            <span>Smart Return Management</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Returns Made <span className="text-primary">Simple</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-down" style={{ animationDelay: '0.2s' }}>
            Let our AI assistant guide you through the return process effortlessly. No more confusion or lengthy wait times.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-down" style={{ animationDelay: '0.3s' }}>
            <a 
              href="#assistant" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
            >
              Get Started
            </a>
            <a 
              href="#how-it-works" 
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all duration-300 hover:translate-y-[-2px]"
            >
              Learn More
            </a>
          </div>
        </div>
        
        <div id="how-it-works" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered return assistant makes the process simple and quick
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Provide Order Details',
                description: 'Tell our assistant your order number and which items you want to return.'
              },
              {
                step: '02',
                title: 'Get Instant Options',
                description: 'Receive personalized return options based on your purchase and our policies.'
              },
              {
                step: '03',
                title: 'Complete Your Return',
                description: 'Print your return label and drop off your package. Track your refund in real-time.'
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="glass-effect rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg group animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div id="assistant" className="mb-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Your Return</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI assistant is ready to help you process your return quickly and easily
            </p>
          </div>
          
          <ReturnAssistant />
        </div>
        
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thousands of customers love how easy it is to process returns with ReturnPal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The return process was incredibly smooth. The assistant guided me through every step and I got my refund faster than expected.",
                author: "Sarah T.",
                role: "Verified Customer"
              },
              {
                quote: "I was dreading having to return an item, but the AI chatbot made it painless. No more waiting on hold with customer service!",
                author: "Michael K.",
                role: "Verified Customer"
              },
              {
                quote: "As someone who hates dealing with returns, this tool is a game-changer. Simple, fast, and actually helpful.",
                author: "Jessica L.",
                role: "Verified Customer"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-background border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <svg className="w-8 h-8 text-primary/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-foreground mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 md:p-12 text-center mb-24 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to simplify your returns?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have made returns stress-free with ReturnPal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#assistant" 
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
            >
              Start a Return
            </a>
            <a 
              href="#how-it-works" 
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all duration-300 hover:translate-y-[-2px]"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
