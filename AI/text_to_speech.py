import torch
from TTS.api import TTS

device = "cuda" if torch.cuda.is_available() else "cpu"

def generate_audio(text, output_file="output.wav"):
    # Initialize TTS with a pre-trained model
    print("Using device:", device)
    tts = TTS(model_name="tts_models/en/ljspeech/fast_pitch", progress_bar=False, gpu=torch.cuda.is_available()).to(device)

    # Generate and save the audio
    tts.tts_to_file(text=text, file_path=output_file, speaker_wav=None, language=None)
    # save the audio to a file
    print(f"Audio saved to {output_file}")

if __name__ == "__main__":
    sample_text = "Hi Bob I hope you are doing well! ."
    generate_audio(sample_text, "output2.wav")