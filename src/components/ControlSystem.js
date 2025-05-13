// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// export default function ControlSystem() {
//     const [rpm, setRpm] = useState('');
//     const [hour, setHour] = useState(0);
//     const [minutes, setMinutes] = useState(0);
//     const [seconds, setSeconds] = useState(0);
//     const [isRunning, setIsRunning] = useState(false);

//     const intervalRef = useRef(null);

//     const sendToThingSpeak = async () => {
//         const url = `https://api.thingspeak.com/update?api_key=3J8GAGL5DDPVYW64&field1=${rpm}&field2=${hour}:${minutes}:${seconds}`;

//         try {
//             const response = await axios.get(url);
//             console.log("⏱️ Live update sent:", `${hour}:${minutes}:${seconds}`, "→ status:", response.data);
//         } catch (error) {
//             console.error("❌ ThingSpeak update error:", error);
//         }
//     };

//     const handleStart = async (e) => {
//         e.preventDefault();
//         setIsRunning(true);
//     };

//     const handleStop = async (e) => {
//         e.preventDefault();
//         clearInterval(intervalRef.current);
//         setIsRunning(false);

//         // Final update to ThingSpeak with stopped time
//         await sendToThingSpeak();
//     };

//     useEffect(() => {
//         if (!isRunning) return;

//         intervalRef.current = setInterval(() => {
//             setSeconds((prevSec) => {
//                 let newSec = prevSec - 1;
//                 let newMin = minutes;
//                 let newHr = hour;

//                 if (newSec < 0) {
//                     if (minutes > 0) {
//                         newSec = 59;
//                         newMin = minutes - 1;
//                     } else if (hour > 0) {
//                         newSec = 59;
//                         newMin = 59;
//                         newHr = hour - 1;
//                     } else {
//                         // Timer ends
//                         clearInterval(intervalRef.current);
//                         setIsRunning(false);
//                         sendToThingSpeak(); // Final update
//                         return 0;
//                     }
//                 }

//                 // Update states
//                 setHour(newHr);
//                 setMinutes(newMin);
//                 sendToThingSpeak(); // 🔁 Live update every second
//                 return newSec;
//             });
//         }, 1000);

//         return () => clearInterval(intervalRef.current);
//     }, [isRunning, hour, minutes]);

//     return (
//         <div className="p-4">
//             <form onSubmit={handleStart}>
//                 <label>RPM</label>
//                 <input
//                     type="text"
//                     value={rpm}
//                     onChange={(e) => setRpm(e.target.value)}
//                     className="border-2 border-primary-300 m-1"
//                 />

//                 <label>Run duration:</label>
//                 <input
//                     type="number"
//                     value={hour}
//                     onChange={(e) => setHour(Number(e.target.value))}
//                     className="border-2 border-primary-300 m-1 w-16"
//                 />
//                 <span>:</span>
//                 <input
//                     type="number"
//                     value={minutes}
//                     onChange={(e) => setMinutes(Number(e.target.value))}
//                     className="border-2 border-primary-300 m-1 w-16"
//                 />
//                 <span>:</span>
//                 <input
//                     type="number"
//                     value={seconds}
//                     onChange={(e) => setSeconds(Number(e.target.value))}
//                     className="border-2 border-primary-300 m-1 w-16"
//                 />

//                 <div className="flex justify-center mt-4">
//                     <button
//                         type="submit"
//                         className="border-2 p-1 border-primary-200 m-2"
//                         disabled={isRunning}
//                     >
//                         Start
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleStop}
//                         className="border-2 p-1 border-primary-200"
//                         disabled={!isRunning}
//                     >
//                         Stop
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }


// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// export default function ControlSystem() {
//     const [rpm, setRpm] = useState('');
//     const [hour, setHour] = useState(0);
//     const [minutes, setMinutes] = useState(0);
//     const [seconds, setSeconds] = useState(0);
//     const [isRunning, setIsRunning] = useState(false);

//     const intervalRef = useRef(null);
//     const updateIntervalRef = useRef(null);

//     const sendToThingSpeak = async (rpmVal, hourVal, minVal, secVal) => {
//         const url = `https://api.thingspeak.com/update?api_key=3J8GAGL5DDPVYW64&field1=${rpmVal}&field2=${hourVal}:${minVal}:${secVal}`;
//         try {
//             const response = await axios.get(url);
//             console.log("ThingSpeak response:", response.data);
//             if (response.data === 0) {
//                 alert("❌ Failed to update ThingSpeak");
//             } else {
//                 console.log("✅ Data sent to ThingSpeak successfully!");
//             }
//         } catch (error) {
//             console.error("Error sending to ThingSpeak", error);
//             alert("❌ Error connecting to ThingSpeak");
//         }
//     };

//     const handleStart = async (e) => {
//         e.preventDefault();
//         if (!rpm) return alert("⚠️ Please enter RPM before starting.");

//         await sendToThingSpeak(rpm, hour, minutes, seconds);
//         setIsRunning(true);

//         updateIntervalRef.current = setInterval(async () => {
//             await sendToThingSpeak(rpm, hour, minutes, seconds);
//         }, 5000);
//     };

//     const handleStop = async (e) => {
//         e.preventDefault();
//         clearInterval(intervalRef.current);
//         clearInterval(updateIntervalRef.current);

//         await sendToThingSpeak(rpm, hour, minutes, seconds);
//         setIsRunning(false);
//     };

//     // Countdown timer
//     useEffect(() => {
//         if (!isRunning) return;

//         intervalRef.current = setInterval(() => {
//             setSeconds((prevSec) => {
//                 if (prevSec > 0) return prevSec - 1;

//                 if (minutes > 0 || hour > 0) {
//                     if (minutes === 0 && hour > 0) {
//                         setHour((h) => h - 1);
//                         setMinutes(59);
//                         return 59;
//                     } else {
//                         setMinutes((m) => m - 1);
//                         return 59;
//                     }
//                 }

//                 // Timer complete
//                 clearInterval(intervalRef.current);
//                 clearInterval(updateIntervalRef.current);
//                 setIsRunning(false);
//                 sendToThingSpeak(rpm, hour, minutes, 0);
//                 return 0;
//             });
//         }, 1000);

//         return () => clearInterval(intervalRef.current);
//     }, [isRunning, hour, minutes]);

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-800 to-orange-500 text-white">
//             <div className="bg-white p-6 rounded-lg shadow-xl w-[95%] max-w-md text-black">
//                 <h1 className="text-center text-2xl font-bold mb-4 text-purple-700">Motor Control System</h1>

//                 <form onSubmit={handleStart}>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">Motor Speed (RPM)</label>
//                         <input
//                             type="number"
//                             value={rpm}
//                             onChange={(e) => setRpm(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-400"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium mb-1">Run Duration (h:m:s)</label>
//                         <div className="flex gap-2">
//                             <input
//                                 type="number"
//                                 value={hour}
//                                 onChange={(e) => setHour(Number(e.target.value))}
//                                 className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-center"
//                             />
//                             <input
//                                 type="number"
//                                 value={minutes}
//                                 onChange={(e) => setMinutes(Number(e.target.value))}
//                                 className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-center"
//                             />
//                             <input
//                                 type="number"
//                                 value={seconds}
//                                 onChange={(e) => setSeconds(Number(e.target.value))}
//                                 className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-center"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex justify-between mt-6">
//                         <button
//                             type="submit"
//                             disabled={isRunning}
//                             className="w-1/2 mr-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
//                         >
//                             Start
//                         </button>
//                         <button
//                             type="button"
//                             onClick={handleStop}
//                             className="w-1/2 ml-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md"
//                         >
//                             Stop
//                         </button>
//                     </div>
//                 </form>

//                 <div className="mt-6 text-center text-sm text-gray-700">
//                     ESP32 IP: <span className="font-mono">192.168.193.78</span>
//                 </div>
//             </div>
//         </div>
//     );
// }






















// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// export default function ControlSystem() {
//     const [rpm, setRpm] = useState('');  // RPM input
//     const [hour, setHour] = useState(0);  // Timer hour
//     const [minutes, setMinutes] = useState(0);  // Timer minutes
//     const [seconds, setSeconds] = useState(0);  // Timer seconds
//     const [isRunning, setIsRunning] = useState(false);  // Timer running state

//     const intervalRef = useRef(null);  // Ref for the interval

//     // Function to send data to ThingSpeak
//     const sendToThingSpeak = async (rpm, hour, minutes, seconds, isRunning) => {
//         const timer = `${hour}:${minutes}:${seconds}`;
//         const startStopFlag = isRunning ? 1 : 0;
//         console.log(timer, startStopFlag)

//         const url = `https://api.thingspeak.com/update?api_key=3J8GAGL5DDPVYW64&field1=${rpm}&field2=${timer}&field3=${startStopFlag}`;

//         try {
//             const response = await axios.get(url);
//             console.log("⏱️ Live update sent:", `${timer}`, "→ status:", response.data);
//         } catch (error) {
//             console.error("❌ ThingSpeak update error:", error);
//         }
//     };

//     // Handle the start button click
//     const handleStart = async (e) => {
//         e.preventDefault();
//         setIsRunning(true);
//         await sendToThingSpeak(rpm, hour, minutes, seconds, true);  // Send start signal (1)
//     };

//     // Handle the stop button click
//     const handleStop = async (e) => {
//         e.preventDefault();

//         setIsRunning(false);

//         // Send last valid timer value and stop signal (0)
//         // Capture current state values for the last update
//         await sendToThingSpeak(rpm, hour, minutes, seconds, false);  // Send stop signal (0) with last timer update
//     };

//     useEffect(() => {
//         if (!isRunning) return;

//         intervalRef.current = setInterval(() => {
//             setSeconds((prevSec) => {
//                 let newSec = prevSec - 1;
//                 let newMin = minutes;
//                 let newHr = hour;

//                 if (newSec < 0) {
//                     if (minutes > 0) {
//                         newSec = 59;
//                         newMin = minutes - 1;
//                     } else if (hour > 0) {
//                         newSec = 59;
//                         newMin = 59;
//                         newHr = hour - 1;
//                     } else {
//                         // Timer ends at 0:0:0

//                         setIsRunning(false);

//                         // Send the last valid timer value to ThingSpeak before stopping (Field 3 -> 0)
//                         sendToThingSpeak(rpm, hour, minutes, seconds, false);  // Send stop signal (0)
//                         return 0;  // Stop the timer here
//                     }
//                 }

//                 // Update time states
//                 setHour(newHr);
//                 setMinutes(newMin);

//                 // Live update every second (Avoid sending 0:0:0)
//                 if (!(newHr === 0 && newMin === 0 && newSec === 0)) {
//                     sendToThingSpeak(rpm, newHr, newMin, newSec, true);  // Send running signal (1)
//                 }

//                 return newSec;
//             });
//         }, 1000);

//         return () => clearInterval(intervalRef.current);
//     }, [isRunning, hour, minutes, rpm]);

//     return (
//         <div className="p-4">
//             <form onSubmit={handleStart}>
//                 <label>RPM</label>
//                 <input
//                     type="text"
//                     value={rpm}
//                     onChange={(e) => setRpm(e.target.value)}
//                     className="border-2 border-primary-300 m-1"
//                 />

//                 <label>Run duration:</label>
//                 <input
//                     type="number"
//                     value={hour}
//                     onChange={(e) => setHour(Number(e.target.value))}
//                     className="border-2 border-primary-300 m-1 w-16"
//                 />
//                 <span>:</span>
//                 <input
//                     type="number"
//                     value={minutes}
//                     onChange={(e) => setMinutes(Number(e.target.value))}
//                     className="border-2 border-primary-300 m-1 w-16"
//                 />
//                 <span>:</span>
//                 <input
//                     type="number"
//                     value={seconds}
//                     onChange={(e) => setSeconds(Number(e.target.value))}
//                     className="border-2 border-primary-300 m-1 w-16"
//                 />

//                 <div className="flex justify-center mt-4">
//                     <button
//                         type="submit"
//                         className="border-2 p-1 border-primary-200 m-2"
//                         disabled={isRunning}
//                     >
//                         Start
//                     </button>
//                     <button
//                         type="button"
//                         onClick={handleStop}
//                         className="border-2 p-1 border-primary-200"
//                         disabled={!isRunning}
//                     >
//                         Stop
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ControlSystem() {
    // ─── State ───────────────────────────────────────────────────────────
    const [rpm, setRpm] = useState('');
    const [hour, setHour] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // ─── Refs ────────────────────────────────────────────────────────────
    const countdownRef = useRef(null);
    const lastStopTime = useRef(0);

    // ─── ThingSpeak Stop-throttled Update ────────────────────────────────
    const sendStopToThingSpeak = async (h, m, s) => {
        const now = Date.now();
        // If less than 15s since last stop-update, skip
        if (now - lastStopTime.current < 15000) {
            console.log('⏱️ Stop update throttled');
            return;
        }
        lastStopTime.current = now;

        const timer = encodeURIComponent(`${h}:${m}:${s}`);
        const url = `https://api.thingspeak.com/update`
            + `?api_key=3J8GAGL5DDPVYW64`
            + `&field1=${rpm}`
            + `&field2=${timer}`
            + `&field3=0`;  // stop flag

        try {
            const resp = await axios.get(url);
            console.log(`✅ Stop update sent → ${h}:${m}:${s} | resp=${resp.data}`);
        } catch (err) {
            console.error('❌ Stop update error:', err.message);
        }
    };

    // ─── Handlers ─────────────────────────────────────────────────────────
    const handleStart = async (e) => {
        e.preventDefault();
        if (!rpm) {
            return alert('Please enter RPM');
        }
        setIsRunning(true);

        const timer = encodeURIComponent(`${hour}:${minutes}:${seconds}`);
        const url = `https://api.thingspeak.com/update`
            + `?api_key=3J8GAGL5DDPVYW64`
            + `&field1=${rpm}`
            + `&field2=${timer}`
            + `&field3=1`;   // <— running flag

        try {
            const resp = await axios.get(url);
            console.log(`✅ Start update sent → ${hour}:${minutes}:${seconds} | resp=${resp.data}`);
        } catch (err) {
            console.error('❌ Start update error:', err.message);
        }
    };


    const handleStop = async e => {
        e.preventDefault();
        clearInterval(countdownRef.current);
        setIsRunning(false);
        // Send the last timer value to ThingSpeak (throttled to 15s)
        await sendStopToThingSpeak(hour, minutes, seconds);
    };

    // ─── Countdown Effect ─────────────────────────────────────────────────
    useEffect(() => {
        if (!isRunning) return;

        countdownRef.current = setInterval(() => {
            setSeconds(prev => {
                let s = prev - 1;
                let m = minutes;
                let h = hour;

                if (s < 0) {
                    if (m > 0) {
                        s = 59;
                        m -= 1;
                    } else if (h > 0) {
                        s = 59;
                        m = 59;
                        h -= 1;
                    } else {
                        // Reached 0:0:0 → auto-stop
                        clearInterval(countdownRef.current);
                        setIsRunning(false);
                        return 0;
                    }
                }

                setHour(h);
                setMinutes(m);
                return s;
            });
        }, 1000);

        return () => clearInterval(countdownRef.current);
    }, [isRunning, hour, minutes]);

    // ─── Render ───────────────────────────────────────────────────────────
    return (
        <div className="p-4 max-w-md mx-auto border rounded">
            <form onSubmit={handleStart} className="space-y-4">
                <div>
                    <label className="block mb-1">RPM:</label>
                    <input
                        type="text"
                        value={rpm}
                        onChange={e => setRpm(e.target.value)}
                        className="w-full border p-1"
                    />
                </div>

                <div>
                    <label className="block mb-1">Duration (hh:mm:ss):</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={hour}
                            onChange={e => setHour(+e.target.value)}
                            className="w-16 border p-1 text-center"
                        />
                        <span>:</span>
                        <input
                            type="number"
                            value={minutes}
                            onChange={e => setMinutes(+e.target.value)}
                            className="w-16 border p-1 text-center"
                        />
                        <span>:</span>
                        <input
                            type="number"
                            value={seconds}
                            onChange={e => setSeconds(+e.target.value)}
                            className="w-16 border p-1 text-center"
                        />
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        type="submit"
                        disabled={isRunning}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Start
                    </button>
                    <button
                        type="button"
                        onClick={handleStop}
                        disabled={!isRunning}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Stop
                    </button>
                </div>
            </form>

            <div className="mt-4 text-center">
                <span className="text-xl font-mono">
                    {String(hour).padStart(2, '0')}:
                    {String(minutes).padStart(2, '0')}:
                    {String(seconds).padStart(2, '0')}
                </span>
            </div>
        </div>
    );
}
