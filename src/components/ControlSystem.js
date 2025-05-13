


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
