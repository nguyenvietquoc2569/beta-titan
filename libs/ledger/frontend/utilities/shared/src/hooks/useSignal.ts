import React from 'react';
import { createSignal } from 'react-signal';
// export const SessionInitContext = React.createContext<IStaffLoginSession|null>(null);
const Signal = createSignal();
export const usePublish = Signal.usePublish
export const useSubscription = Signal.useSubscription
export const SignalProvide = Signal.Provider as React.FC<{}>
