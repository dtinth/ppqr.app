// Utility typess
type Nullable<T> = T | null

// Preact's shorthand types
type PreactPointerEventHandler<E extends HTMLElement> = JSX.EventHandler<
  JSX.TargetedPointerEvent<E>
>
