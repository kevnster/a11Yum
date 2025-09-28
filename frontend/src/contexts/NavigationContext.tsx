import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface NavigationContextType {
  isShowingRecipeDetail: boolean;
  currentRecipeTitle: string | null;
  activeTab: string | null;
  setRecipeDetailState: (isShowing: boolean, recipeTitle?: string, tabName?: string) => void;
  goBackFromRecipe: (() => void) | null;
  setGoBackFunction: (goBackFn: (() => void) | null) => void;
  setActiveTab: (tabName: string) => void;
  isRecipeDetailForTab: (tabName: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isShowingRecipeDetail, setIsShowingRecipeDetail] = useState(false);
  const [currentRecipeTitle, setCurrentRecipeTitle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [recipeDetailTab, setRecipeDetailTab] = useState<string | null>(null);
  const goBackFunctionRef = useRef<(() => void) | null>(null);

  const setRecipeDetailState = (isShowing: boolean, recipeTitle?: string, tabName?: string) => {
    console.log('🔧 NavigationContext: setRecipeDetailState', { isShowing, recipeTitle, tabName });
    setIsShowingRecipeDetail(isShowing);
    setCurrentRecipeTitle(recipeTitle || null);
    setRecipeDetailTab(isShowing ? (tabName || activeTab) : null);
  };

  const setGoBackFunction = (goBackFn: (() => void) | null) => {
    console.log('🔧 NavigationContext: setGoBackFunction', { goBackFn: !!goBackFn });
    goBackFunctionRef.current = goBackFn;
  };

  const executeGoBack = () => {
    console.log('🔧 NavigationContext: executeGoBack called', { hasFunction: !!goBackFunctionRef.current });
    if (goBackFunctionRef.current) {
      goBackFunctionRef.current();
    }
  };

  const handleSetActiveTab = (tabName: string) => {
    console.log('🔧 NavigationContext: setActiveTab', { tabName, currentRecipeDetailTab: recipeDetailTab });
    setActiveTab(tabName);
  };

  const isRecipeDetailForTab = (tabName: string) => {
    const result = isShowingRecipeDetail && recipeDetailTab === tabName;
    console.log('🔧 NavigationContext: isRecipeDetailForTab', { tabName, recipeDetailTab, isShowingRecipeDetail, result });
    return result;
  };

  return (
    <NavigationContext.Provider 
      value={{
        isShowingRecipeDetail,
        currentRecipeTitle,
        activeTab,
        setRecipeDetailState,
        goBackFromRecipe: executeGoBack,
        setGoBackFunction,
        setActiveTab: handleSetActiveTab,
        isRecipeDetailForTab,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};