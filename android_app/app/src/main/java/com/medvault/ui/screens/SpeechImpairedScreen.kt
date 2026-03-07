package com.medvault.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.medvault.ui.theme.LocalAccessibilityState

data class SymptomIcon(val id: String, val label: String, val emoji: String)

val commonSymptoms = listOf(
    SymptomIcon("1", "Headache", "🤕"),
    SymptomIcon("2", "Nausea", "🤢"),
    SymptomIcon("3", "Pain", "💥"),
    SymptomIcon("4", "Fever", "🤒"),
    SymptomIcon("5", "Dizzy", "😵"),
    SymptomIcon("6", "Heart", "❤️‍🩹"),
    SymptomIcon("7", "Fatigue", "😴"),
    SymptomIcon("8", "Cough", "😷")
)

@Composable
fun SpeechImpairedScreen(
    onSendToAI: (String) -> Unit
) {
    val accessibilityState = LocalAccessibilityState.current
    var selectedSymptoms by remember { mutableStateOf(listOf<String>()) }
    
    // One Handed Mode padding shift
    val topPadding = if (accessibilityState.isOneHandedMode) 150.dp else 16.dp

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = topPadding, start = 16.dp, end = 16.dp, bottom = 16.dp)
    ) {
        Text(
            text = "Tap icons to build a report",
            style = MaterialTheme.typography.titleLarge,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.weight(1f),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(commonSymptoms) { symptom ->
                Card(
                    modifier = Modifier
                        .height(120.dp) // Large target
                        .clickable {
                            if (!selectedSymptoms.contains(symptom.label)) {
                                selectedSymptoms = selectedSymptoms + symptom.label
                            }
                        }
                        .semantics {
                            contentDescription = "Add ${symptom.label} to symptom list"
                        }
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(text = symptom.emoji, style = MaterialTheme.typography.displayMedium)
                        Text(text = symptom.label, style = MaterialTheme.typography.bodyLarge)
                    }
                }
            }
        }
        
        // Symptom Sentence Builder
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("I am experiencing:")
                Text(
                    text = if (selectedSymptoms.isEmpty()) "..." else selectedSymptoms.joinToString(", "),
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }
        }

        // Action Button
        Button(
            onClick = {
                val message = "I am experiencing: " + selectedSymptoms.joinToString(", ")
                onSendToAI(message)
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp) // >= 48dp minimum target size
                .semantics {
                    contentDescription = "Send symptom report to the AI"
                },
            enabled = selectedSymptoms.isNotEmpty()
        ) {
            Text("Send to AI", style = MaterialTheme.typography.titleMedium)
        }
    }
}
