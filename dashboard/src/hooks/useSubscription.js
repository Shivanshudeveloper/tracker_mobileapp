import { useContext } from 'react'
import { SubscriptionContext } from '../contexts/subscriptionContext'

export const useSubscription = () => useContext(SubscriptionContext)
