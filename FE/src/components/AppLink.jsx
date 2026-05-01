function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export default function AppLink({
  to,
  navigate,
  onClick,
  className = "",
  children,
  ...props
}) {
  const handleClick = (event) => {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      isModifiedEvent(event) ||
      props.target === "_blank"
    ) {
      return
    }

    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}
