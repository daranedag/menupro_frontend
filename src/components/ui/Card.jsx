function Card({ 
  children, 
  title,
  subtitle,
  footer,
  hoverable = false,
  padding = 'md',
  className = ''
}) {
  const baseStyles = 'bg-white rounded-lg shadow';
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {(title || subtitle) && (
        <div className={`${paddings[padding]} border-b`}>
          {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={paddings[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className={`${paddings[padding]} border-t bg-gray-50 rounded-b-lg`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
