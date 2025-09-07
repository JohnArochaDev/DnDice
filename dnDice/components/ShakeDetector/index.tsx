import { Accelerometer } from 'expo-sensors';

const THRESHOLD = 150;

export class ShakeDetector {
  static addListener(handler: () => void) {
    let last_x: number | undefined, last_y: number | undefined, last_z: number | undefined;
    let lastUpdate = 0;

    Accelerometer.setUpdateInterval(100);

    Accelerometer.addListener(accelerometerData => {
      let { x, y, z } = accelerometerData;
      let currTime = Date.now();

      if ((currTime - lastUpdate) > 100) {
        let diffTime = (currTime - lastUpdate);
        lastUpdate = currTime;
        let speed = Math.abs(x + y + z - (last_x ?? 0) - (last_y ?? 0) - (last_z ?? 0)) / diffTime * 10000;

        if (speed > THRESHOLD) {
          handler();
        }

        last_x = x;
        last_y = y;
        last_z = z;
      }
    });
  }

  static removeListener() {
    Accelerometer.removeAllListeners();
  }
}