package com.medvault.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

class AccessibilityState(
    val isHighContrast: Boolean,
    val isOneHandedMode: Boolean
)

val LocalAccessibilityState = staticCompositionLocalOf { AccessibilityState(false, false) }

// Standard Colors
private val LightColors = lightColorScheme(
    primary = Color(0xFF0052CC),
    secondary = Color(0xFF00B8D9),
    error = Color(0xFFFF5630)
)
private val DarkColors = darkColorScheme(
    primary = Color(0xFF0052CC), // Blue
    secondary = Color(0xFF00B8D9), // Cyan
    error = Color(0xFFFF5630) // Red
)

// High Contrast Colors
private val HighContrastLightColors = lightColorScheme(
    primary = Color(0xFF000000),
    secondary = Color(0xFF000000),
    background = Color(0xFFFFFFFF),
    error = Color(0xFFD32F2F)
)
private val HighContrastDarkColors = darkColorScheme(
    primary = Color(0xFFFFFFFF),
    secondary = Color(0xFFFFFFFF),
    background = Color(0xFF000000),
    error = Color(0xFFFF2A2A)
)

@Composable
fun MedVaultTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    isHighContrast: Boolean = false,
    isOneHandedMode: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        isHighContrast && darkTheme -> HighContrastDarkColors
        isHighContrast && !darkTheme -> HighContrastLightColors
        darkTheme -> DarkColors
        else -> LightColors
    }
    
    val accessibilityState = AccessibilityState(isHighContrast, isOneHandedMode)

    CompositionLocalProvider(LocalAccessibilityState provides accessibilityState) {
        MaterialTheme(
            colorScheme = colorScheme,
            content = content
        )
    }
}
