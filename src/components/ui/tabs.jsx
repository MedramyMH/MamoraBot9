import React from 'react';

const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value);
  
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={`w-full ${className || ''}`} {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, onTabChange: handleTabChange })
      )}
    </div>
  );
};

const TabsList = ({ className, children, activeTab, onTabChange, ...props }) => (
  <div
    className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ''}`}
    {...props}
  >
    {React.Children.map(children, child => 
      React.cloneElement(child, { activeTab, onTabChange })
    )}
  </div>
);

const TabsTrigger = ({ className, value, children, activeTab, onTabChange, ...props }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value 
        ? 'bg-background text-foreground shadow-sm' 
        : 'hover:bg-background/80'
    } ${className || ''}`}
    onClick={() => onTabChange && onTabChange(value)}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ className, value, children, activeTab, ...props }) => {
  if (activeTab !== value) return null;
  
  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };