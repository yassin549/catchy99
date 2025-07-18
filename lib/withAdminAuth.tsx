import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import { CircleLoader } from '@/components'

const withAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = props => {
    const { user, initialized } = useAuth()
    const router = useRouter()

    useEffect(() => {
      // Wait until the initial session check is complete.
      if (initialized && (!user || !user.roles.includes('admin'))) {
        router.replace('/login')
      }
    }, [user, initialized, router])

    // While the session is being checked, or if the user is not an admin, show a loader.
    if (!initialized || !user || !user.roles.includes('admin')) {
      return <CircleLoader visible={true} />
    }

    // If authentication check has passed, render the component.
    return <WrappedComponent {...props} />
  }

  Wrapper.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return Wrapper
}

export { withAdminAuth }
