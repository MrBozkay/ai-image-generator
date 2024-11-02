import { useEffect, useState } from 'react'

export function useNonce() {
  const [nonce, setNonce] = useState<string | undefined>(undefined)

  useEffect(() => {
    setNonce((window as any).__NONCE__)
  }, [])

  return nonce
}