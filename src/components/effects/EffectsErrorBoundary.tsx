import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class EffectsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.warn('[Cosmos] Post-processing effects failed to initialize:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}
