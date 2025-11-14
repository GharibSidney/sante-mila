import argparse
import whisper
import torch

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="medium", help="Whisper model to use",
                        choices=["tiny", "base", "small", "medium", "large"])
    parser.add_argument("--non_english", action='store_true',
                        help="Use the multilingual version instead of the English-only model")
    parser.add_argument("--file", required=True, help="Path to the .mp3 (or .wav) file")
    args = parser.parse_args()

    # Choose CUDA or CPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    # Choose model name with .en or without
    model_name = args.model
    if args.model != "large" and not args.non_english:
        model_name += ".en"

    print(f"Loading model: {model_name}")
    model = whisper.load_model(model_name, device=device)

    # Transcribe the file directly
    print(f"Transcribing: {args.file}")
    result = model.transcribe(args.file, fp16=torch.cuda.is_available())

    print("\n--- Transcription Output ---\n")
    print(result["text"].strip())


if __name__ == "__main__":
    main()
