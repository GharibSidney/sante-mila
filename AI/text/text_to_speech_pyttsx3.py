import pyttsx3

# Initialize the engine
engine = pyttsx3.init()

# Set properties (optional)
engine.setProperty('rate', 150)  # Adjust speech rate (words per minute)
engine.setProperty('volume', 0.9) # Adjust volume (0.0 to 1.0)

# Get available voices and set a specific one (optional)
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id) # Select the second voice (e.g., female)

# Text to be spoken
text = "Hello, world! This is a text-to-speech example using PYTTSX3."

# Speak the text
engine.say(text)

# Run the engine and wait for speech to finish
engine.runAndWait()

# Save speech to a file (e.g., MP3)
engine.save_to_file(text, 'output.mp3')
engine.runAndWait()

# Stop the engine
engine.stop()