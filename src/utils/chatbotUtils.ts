
// Generate a unique ID for each message
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Get initial bot message
export function getInitialMessage(): string {
  return "Hello! Welcome to ReturnPal. I'm your Return Assistant. How can I help you with your return or refund today?";
}

// Simulate typing delay based on message length
export function getTypingDelay(text: string): number {
  const baseDelay = 500; // minimum delay in ms
  const perCharDelay = 20; // ms per character
  const maxDelay = 2000; // maximum delay in ms
  
  const calculatedDelay = baseDelay + (text.length * perCharDelay);
  return Math.min(calculatedDelay, maxDelay);
}

// Extract information from user input (Mock implementation)
export function extractOrderInfo(text: string): string | null {
  const orderPattern = /order\s*#?\s*(\d+)/i;
  const match = text.match(orderPattern);
  return match ? match[1] : null;
}

// Simple function to determine if user input is about a return
export function isReturnRequest(text: string): boolean {
  const returnKeywords = ['return', 'send back', 'refund', 'exchange', 'broken', 'damaged', 'wrong item'];
  return returnKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

// Handle user message and get bot response (Simple implementation)
export function getBotResponse(userMessage: string): string {
  const userMessageLower = userMessage.toLowerCase();
  
  // Check if the message contains order information
  const orderNumber = extractOrderInfo(userMessageLower);
  
  if (orderNumber) {
    return `Thanks for providing your order number #${orderNumber}. Could you please tell me the reason you'd like to return this item?`;
  }
  
  if (userMessageLower.includes('help') || userMessageLower.includes('assistance')) {
    return "I'm here to help with your return or refund. Could you provide your order number so I can assist you better?";
  }
  
  if (isReturnRequest(userMessageLower)) {
    return "I understand you want to make a return. To help you with this process, could you please provide your order number?";
  }
  
  if (userMessageLower.includes('policy') || userMessageLower.includes('policies')) {
    return "Our return policy allows returns within 30 days of purchase. Items should be in their original condition with tags attached. Would you like more specific details about our policy?";
  }
  
  if (userMessageLower.includes('human') || userMessageLower.includes('agent') || userMessageLower.includes('person')) {
    return "I'd be happy to connect you with a human support agent. Our support team is available Monday-Friday, 9am-5pm EST. Would you like me to arrange that for you?";
  }
  
  if (userMessageLower.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with regarding your return or refund?";
  }
  
  // Default response
  return "I'm here to help with your return or refund. Could you provide more details about your order, such as your order number or the item you want to return?";
}
