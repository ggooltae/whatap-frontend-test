import { useCallback, useEffect, useState } from 'react';

function useMessageQueue() {
  const [isFetching, setIsFetching] = useState(false);
  const [fetchQueue, setFetchQueue] = useState<(() => Promise<void>)[]>([]);

  const addMessageQueue = useCallback((fn: () => Promise<void>) => {
    setFetchQueue((fetchQueue) => [...fetchQueue, fn]);
  }, []);

  useEffect(() => {
    if (isFetching || fetchQueue.length === 0) return;

    (async () => {
      setIsFetching(true);

      await fetchQueue[0]();

      setIsFetching(false);
      setFetchQueue((fetchQueue) => fetchQueue.slice(1));
    })();
  }, [fetchQueue]);

  return addMessageQueue;
}

export default useMessageQueue;
