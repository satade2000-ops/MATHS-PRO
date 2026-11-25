import React from 'react';

interface MathFormulaTextProps {
  text: string;
  className?: string;
}

/**
 * Renders mathematical strings safely in React without dangerouslySetInnerHTML,
 * supporting `<sup>...</sup>` exponents cleanly.
 */
export const MathFormulaText: React.FC<MathFormulaTextProps> = ({ text, className = '' }) => {
  const parts = text.split(/(<sup>.*?<\/sup>)/g);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('<sup>') && part.endsWith('</sup>')) {
          const inner = part.slice(5, -6);
          return (
            <sup key={idx} className="text-[0.65em] align-super font-bold ml-0.5">
              {inner}
            </sup>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};
