import toast from 'react-hot-toast'

export const notify = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      icon: '✅',
      style: {
        background: 'rgba(34, 197, 94, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        color: '#fff',
      },
    })
  },

  error: (message: string) => {
    toast.error(message, {
      duration: 5000,
      icon: '❌',
      style: {
        background: 'rgba(239, 68, 68, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#fff',
      },
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        color: '#fff',
      },
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
        },
      }
    )
  },

  info: (message: string) => {
    toast(message, {
      duration: 4000,
      icon: 'ℹ️',
      style: {
        background: 'rgba(59, 130, 246, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        color: '#fff',
      },
    })
  },

  warning: (message: string) => {
    toast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        background: 'rgba(251, 191, 36, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        color: '#fff',
      },
    })
  },
}