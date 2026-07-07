import { useEffect, useRef } from 'react'

// Modal a11y baseline (WCAG 2.1.2 / 2.4.3): move focus into the dialog on open,
// close on Escape, and restore focus to the trigger on unmount. Attach the
// returned ref to the dialog panel and give that panel tabIndex={-1}.
// `active` lets a self-gating modal (mounted before it's open) trigger the
// focus/Escape wiring only once it actually opens. Callers rendered
// conditionally by a parent can leave it defaulted to true.
export function useDialogA11y(onClose, active = true) {
  const dialogRef = useRef(null)
  const previouslyFocused = useRef(null)
  useEffect(() => {
    if (!active) return undefined
    previouslyFocused.current = document.activeElement
    dialogRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose?.() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused.current?.focus) previouslyFocused.current.focus()
    }
  }, [onClose, active])
  return dialogRef
}
