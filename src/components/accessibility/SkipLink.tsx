interface Props {
  targetId?: string;
  label?: string;
}

export function SkipLink({ targetId = 'main-content', label = 'Skip to main content' }: Props) {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  };

  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={label}
    >
      {label}
    </a>
  );
}
