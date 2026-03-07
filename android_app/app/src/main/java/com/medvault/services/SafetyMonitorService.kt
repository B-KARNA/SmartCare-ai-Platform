package com.medvault.services

import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.LocationManager
import android.media.AudioManager
import android.media.RingtoneManager
import android.os.CountDownTimer
import android.os.IBinder
import android.telephony.SmsManager
import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlin.math.sqrt

class SafetyMonitorService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    
    // Fall Detection Constants (Standard gravity is ~9.8 m/s^2)
    private val FALL_IMPACT_THRESHOLD = 30.0 // roughly 3G impact
    private val INACTIVITY_THRESHOLD = 12.0 // sub-movement state
    
    private var isFallDetected = false
    private var fallTimer: CountDownTimer? = null
    
    // Heart Rate Monitoring
    private val serviceScope = CoroutineScope(Dispatchers.IO + Job())
    private val currentBpm = MutableStateFlow(72)
    private var abnormalBpmStartTime: Long = 0

    override fun onCreate() {
        super.onCreate()
        
        // 1. Initialize Accelerometer
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL)
        
        // 2. Start Heart Rate Simulation Flow
        startHeartRateMonitoring()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    // =========================================================================
    // FALL DETECTION LOGIC (Accelerometer Vector Magnitude)
    // =========================================================================
    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_ACCELEROMETER) {
            val x = event.values[0]
            val y = event.values[1]
            val z = event.values[2]

            // Calculate Vector Magnitude: sqrt(x^2 + y^2 + z^2)
            val magnitude = sqrt((x * x + y * y + z * z).toDouble())

            if (!isFallDetected) {
                if (magnitude > FALL_IMPACT_THRESHOLD) {
                    Log.d("SafetyNet", "High impact detected! Magnitude: $magnitude")
                    isFallDetected = true
                }
            } else {
                // If impact occurred, check for post-fall inactivity
                if (magnitude < INACTIVITY_THRESHOLD) {
                    // Trigger the SOS countdown
                    triggerFallCountdown()
                } else {
                    // False alarm, user is moving vigorously again
                    isFallDetected = false 
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun triggerFallCountdown() {
        if (fallTimer != null) return // Already running

        Log.d("SafetyNet", "Fall Protocol Initiated. 15 second countdown started.")
        
        fallTimer = object : CountDownTimer(15000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                Log.d("SafetyNet", "Fall SOS in ${millisUntilFinished / 1000}s...")
                // In a real app, broadcast an intent here to show a cancel UI to the user
            }

            override fun onFinish() {
                executeEmergencySOS("Fall Detected")
            }
        }.start()
    }

    // =========================================================================
    // HEART RATE MONITORING 
    // =========================================================================
    private fun startHeartRateMonitoring() {
        serviceScope.launch {
            while (isActive) {
                val bpm = currentBpm.value
                
                // Check if BPM is dangerously high (>120) or low (<40)
                if (bpm > 120 || bpm < 40) {
                    if (abnormalBpmStartTime == 0L) {
                        abnormalBpmStartTime = System.currentTimeMillis()
                    } else {
                        // Check if it has persisted for 2 minutes (120,000 ms)
                        val elapsed = System.currentTimeMillis() - abnormalBpmStartTime
                        if (elapsed >= 120_000) {
                            Log.d("SafetyNet", "Critical BPM persisting! Escalating to Emergency Agent.")
                            triggerMedicalEmergencyAgent(bpm)
                            abnormalBpmStartTime = 0L // Reset after triggering
                        }
                    }
                } else {
                    abnormalBpmStartTime = 0L // Reset if normal
                }
                
                delay(2000) // Check every 2 seconds
            }
        }
    }

    private fun triggerMedicalEmergencyAgent(criticalBpm: Int) {
        // Fire a Retrofit/OkHttp request to FastAPI: /api/chat/route
        // POST {"message": "Heart rate critical at $criticalBpm BPM. Needs Emergency Agent."}
        Log.d("SafetyNet", "Sending Critical BPM alert to FastAPI Master Router.")
    }

    // =========================================================================
    // EMERGENCY EXECUTION
    // =========================================================================
    private fun executeEmergencySOS(triggerReason: String) {
        Log.d("SafetyNet", "Executing Final SOS Sequence: $triggerReason")
        
        // 1. Get Location (Stub)
        val locationMsg = "Lat: 19.0760, Lng: 72.8777 (Mumbai)" 

        // 2. Play Loud Alarm
        playMaximumVolumeAlarm()

        // 3. Send SMS
        val emergencyContact = "+919876543210"
        val message = "EMERGENCY ALERT: $triggerReason. User's last known location: $locationMsg"
        sendSMS(emergencyContact, message)

        // Reset state
        isFallDetected = false
        fallTimer = null
    }

    private fun playMaximumVolumeAlarm() {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        audioManager.setStreamVolume(
            AudioManager.STREAM_ALARM,
            audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM),
            0
        )
        val uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        val ringtone = RingtoneManager.getRingtone(applicationContext, uri)
        ringtone.play()
    }

    private fun sendSMS(phoneNumber: String, message: String) {
        try {
            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(phoneNumber, null, message, null, null)
            Log.d("SafetyNet", "SMS Sent successfully to $phoneNumber")
        } catch (e: Exception) {
            Log.e("SafetyNet", "Failed to send SMS: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
        fallTimer?.cancel()
        serviceScope.cancel()
    }
}
