import { triggerChatbot } from '../components/ChatbotManager';

/**
 * Utility functions for interacting with the AI Tutor chatbot
 */

/**
 * Opens the chatbot dialog
 */
export const openChatbot = () => {
  triggerChatbot();
};

/**
 * Opens the chatbot with a specific context or question
 * Note: This doesn't auto-send the message, it just opens the chat
 * with this message pre-filled
 * 
 * @param {string} message - The message to pre-fill in the chat input
 */
export const openChatbotWithQuestion = (message) => {
  // First trigger the chatbot to open
  triggerChatbot();
  
  // Then set the message in the input field
  // Since this happens async, we need to wait a bit
  setTimeout(() => {
    const event = new CustomEvent('setChatbotInput', { 
      detail: { message } 
    });
    window.dispatchEvent(event);
  }, 300);
};

/**
 * Example usage of context-specific chatbot triggers
 * These can be used from different parts of the application
 */

export const askForStudyPlanHelp = () => {
  openChatbotWithQuestion("Can you help me create a study plan for JEE preparation?");
};

export const askForPhysicsHelp = () => {
  openChatbotWithQuestion("I'm having trouble with physics concepts. Can you help me?");
};

export const askForChemistryHelp = () => {
  openChatbotWithQuestion("How can I memorize chemistry formulas more effectively?");
};

export const askForMathHelp = () => {
  openChatbotWithQuestion("What's the best way to practice mathematics for JEE?");
};

export const askForExamTips = () => {
  openChatbotWithQuestion("What are some test-taking strategies for the JEE exam?");
}; 