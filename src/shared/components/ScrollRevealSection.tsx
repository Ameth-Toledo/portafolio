interface ScrollRevealSectionProps {
  id?: string
  children: React.ReactNode
  className?: string
}

function ScrollRevealSection({ id, children, className = '' }: ScrollRevealSectionProps) {
  return (
    <div
      id={id}
      className="relative h-screen w-full"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <div className={`fixed bottom-0 left-0 h-screen w-full ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default ScrollRevealSection
