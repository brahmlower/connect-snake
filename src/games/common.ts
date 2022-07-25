import { ConnectBoardDriver } from '../ConnectBoardDriver';

export interface PlayerInput<T> {
  latestInput: () => T | null
}

export interface Scene<S, I> {
  state: S
  initialRender(driver: ConnectBoardDriver): void,
  tick: (driver: ConnectBoardDriver, playerInput: PlayerInput<I> | null) => Scene<any, I> | undefined
}
