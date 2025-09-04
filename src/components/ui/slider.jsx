import React from 'react';

const Slider = React.forwardRef(({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
  const handleChange = (e) => {
    const newValue = [parseInt(e.target.value)];
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className || ''}`} {...props}>
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
});
Slider.displayName = "Slider";

export { Slider };