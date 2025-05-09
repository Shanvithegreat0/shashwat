import { _authService } from './service';

// Functions to handle user onboarding data
export const saveOnboardingData = async (data) => {
  try {
    // Save to backend (commented out for now)
    // return await _authService('/user/onboarding', 'POST', data);
    
    // For now, save to localStorage
    localStorage.setItem('onboardingData', JSON.stringify({
      ...data,
      completed: true,
      completedAt: new Date().toISOString()
    }));
    
    return { success: true };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return { success: false, error };
  }
};

export const getOnboardingData = () => {
  try {
    const data = localStorage.getItem('onboardingData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving onboarding data:', error);
    return null;
  }
};

export const hasCompletedOnboarding = () => {
  const data = getOnboardingData();
  return !!data && data.completed === true;
};

export const skipOnboarding = () => {
  localStorage.setItem('onboardingData', JSON.stringify({
    skipped: true,
    completed: true,
    timestamp: new Date().toISOString()
  }));
  return { success: true };
};

export const clearOnboardingData = () => {
  localStorage.removeItem('onboardingData');
  return { success: true };
}; 