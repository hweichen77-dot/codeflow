import { useEffect, useRef } from 'react'

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
