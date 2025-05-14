
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import fan from '../assests/fan.png'
import { useNavigate } from 'react-router-dom';

export default function ControlSystem() {


    const BeURL = process.env.REACT_APP_BeURL

    const use = useNavigate()
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

        // const timer = encodeURIComponent(`${h}:${m}:${s}`);
        const url = `https://api.thingspeak.com/update`
            + `?api_key=3J8GAGL5DDPVYW64`
            + `&field1=${rpm}`
            + `&field2=1`
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

        // const timer = encodeURIComponent(`${hour}:${minutes}:${seconds}`);
        const url = `https://api.thingspeak.com/update`
            + `?api_key=3J8GAGL5DDPVYW64`
            + `&field1=${rpm}`
            + `&field2=1`
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
            setSeconds(prevSeconds => {
                let s = prevSeconds - 1;
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
                        // At this point, s is -1, m is 0, h is 0
                        s = 0; // normalize to 0

                        (async () => {
                            const url = `https://api.thingspeak.com/update`
                                + `?api_key=3J8GAGL5DDPVYW64`
                                + `&field1=${rpm}`
                                + `&field2=0`
                                + `&field3=1`;

                            try {
                                const resp = await axios.get(url);
                                console.log(`✅ Timer ended → ${h}:${m}:${s} | resp=${resp.data}`);
                            } catch (err) {
                                console.error('❌ API call failed at timer end:', err.message);
                            }
                        })();

                        clearInterval(countdownRef.current);
                        setIsRunning(false);
                        setHour(0);
                        setMinutes(0);
                        return 0;
                    }
                }

                setHour(h);
                setMinutes(m);
                return s;
            });
        }, 1000);

        return () => clearInterval(countdownRef.current);
    }, [isRunning, hour, minutes, rpm]);


    const logout = () => {
        fetch(`${BeURL}/logout`, {
            method: "DELETE",
            credentials: "include"

        })
            .then(res => res.json())
            .then(data => {
                use('/')
                console.log(data)

            })
            .catch(err => {
                console.log("Error :", err)
                alert("Trouble in conncting to Server")
            })
    }

    // ─── Render ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col justify-start items-center px-4 py-6 bg-gradient-to-br from-purple-300 via-red-400 to-orange-50 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center w-full p-4">
                {/* Left: Heading */}
                <h1 className="text-2xl font-bold mb-4 md:mb-0 text-center md:text-center">
                    Motor Control System
                </h1>

                {/* Right: Logout Button */}
                <button
                    className="py-2 px-4 bg-red-500 rounded-full text-white font-bold shadow-lg"
                    onClick={() => logout()}
                >
                    Logout
                </button>
            </div>



            {/* Connection Status Card */}
            <div className="w-full max-w-md bg-red-300 rounded-xl p-4 mb-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                        {`${isRunning ? 'Connected' : 'Disconnected'}`}
                    </span>
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-400 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition">
                    🔌 Connect to ESP32
                </button>
            </div>

            {/* Speed Status Card */}
            <div className="w-full max-w-md bg-red-500/30 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-inner">
                <div className="flex items-center justify-center mb-2">
                    <div className="text-5xl animate-spin-slow"><img src={fan} className={`w-32 ${isRunning ? "rotate" : ""}`} /></div>
                </div>
                <p className="text-center text-white text-sm mb-1">Speed: {`${rpm === '' ? 0 : rpm}`}</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-full rounded-full transition-all duration-300" style={{ width: `${rpm === '' ? 0 : rpm}%` }}></div>
                </div>
                <p className="text-center text-white text-sm">Status: {`${isRunning ? 'Online Mode' : 'Offline Mode'}`}</p>
            </div>

            <form  >
                {/* Motor Speed Input */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-4 text-white">
                    <label className="block mb-1 text-sm font-semibold">Motor Speed (RPM):</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded-md bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter RPM"
                        value={rpm}
                        onChange={e => setRpm(e.target.value)}
                    />
                </div>

                {/* Run Duration Input */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-4 text-white">
                    <label className="block mb-2 text-sm font-semibold">Run Duration (h:m:s):</label>
                    <div className="flex justify-between gap-2">
                        <input
                            type="number"
                            className="w-full p-2 rounded-md bg-white/20 text-white text-center"
                            placeholder="0" value={hour}
                            onChange={(e) => setHour(e.target.value)}
                        />
                        <span className="text-xl font-bold">:</span>
                        <input
                            type="number"
                            className="w-full p-2 rounded-md bg-white/20 text-white text-center"
                            placeholder="0"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                        />
                        <span className="text-xl font-bold">:</span>
                        <input
                            type="number"
                            className="w-full p-2 rounded-md bg-white/20 text-white text-center"
                            placeholder="0"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                        />
                    </div>
                </div>
            </form>

            {/* Start / Stop Buttons */}
            <div className="w-full max-w-md flex justify-between gap-4 mt-2">
                <button className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-full text-white font-bold shadow-lg" disabled={isRunning} onClick={handleStart}>
                    Start
                </button>
                <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-800 rounded-full text-white font-bold shadow-lg" onClick={handleStop}
                    disabled={!isRunning}>
                    Stop
                </button>
            </div>

            {/* ESP32 IP Info */}
            <p className="text-xs mt-6 opacity-80">ESP32 IP: 192.168.193.78</p>
        </div>
    );
}


{/* <div className="p-4 max-w-md mx-auto border rounded">
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
</div> */}