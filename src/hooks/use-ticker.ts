import * as React from "react";

const DURATION = 30;

export function useTicker() {
  const [time, setTime] = React.useState<number>(DURATION);
  const [isCounting, setCounting] = React.useState(true);

  React.useEffect(() => {
    if (!isCounting) return;

    const ticker = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          setCounting(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(ticker);
  }, [isCounting]);

  function restart() {
    setTime(DURATION);
    setCounting(true);
  }

  function stop() {
    setTime(DURATION);
    setCounting(false);
  }

  return {
    time,
    restart,
    stop,
    isCounting,
  };
}
