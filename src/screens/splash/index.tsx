import {useEffect} from 'react';
import {setRouteState} from 'stores';

const SplashScreen = () => {
  useEffect(() => {
    setRouteState('MAIN');
  }, []);

  return null;
};

export default SplashScreen;
